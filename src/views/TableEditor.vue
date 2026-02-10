<template>
  <div class="table-editor">
    <el-card>
      <template #header>
        <div class="card-header">
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/tables' }">Таблицы</el-breadcrumb-item>
              <el-breadcrumb-item>{{ tableName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-actions">
            <el-button type="primary" :icon="Plus" @click="handleAdd">
              Добавить запись
            </el-button>
            <el-button :icon="Refresh" @click="loadData">Обновить</el-button>
          </div>
        </div>
      </template>

      <!-- Filters -->
      <div class="filters" v-if="columns.length > 0">
        <el-input
          v-model="searchQuery"
          placeholder="Поиск..."
          :prefix-icon="Search"
          style="width: 300px; margin-right: 10px;"
          clearable
        />
        <el-select
          v-model="selectedColumn"
          placeholder="Колонка"
          style="width: 200px; margin-right: 10px;"
        >
          <el-option
            v-for="col in columns"
            :key="col.column_name"
            :label="col.column_name"
            :value="col.column_name"
          />
        </el-select>
      </div>

      <!-- Data Table -->
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%; margin-top: 20px;"
        border
      >
        <el-table-column
          v-for="column in columns"
          :key="column.column_name"
          :prop="column.column_name"
          :label="column.column_name"
          :min-width="150"
        >
          <template #default="{ row }">
            {{ formatValue(row[column.column_name]) }}
          </template>
        </el-table-column>
        
        <el-table-column label="Действия" width="150" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" :icon="Edit" @click="handleEdit(row)">
              Изменить
            </el-button>
            <el-button text type="danger" :icon="Delete" @click="handleDelete(row)">
              Удалить
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <el-pagination
        v-if="pagination.total > 0"
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.limit"
        :total="pagination.total"
        :page-sizes="[10, 25, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: center;"
        @current-change="loadData"
        @size-change="loadData"
      />
    </el-card>

    <!-- Edit/Add Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'edit' ? 'Редактировать запись' : 'Добавить запись'"
      width="600px"
    >
      <el-form :model="formData" label-width="150px">
        <el-form-item
          v-for="column in columns"
          :key="column.column_name"
          :label="column.column_name"
        >
          <el-input
            v-model="formData[column.column_name]"
            :disabled="column.column_name === primaryKey && dialogMode === 'edit'"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="handleSave">Сохранить</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Plus, Refresh, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTableSchema, getTableData, createRow, updateRow, deleteRow } from '@/api/tables'

const route = useRoute()
const schema = ref(route.params.schema)
const tableName = ref(route.params.tableName)

const loading = ref(false)
const columns = ref([])
const rawTableData = ref([])
const primaryKey = ref('id')
const searchQuery = ref('')
const selectedColumn = ref('')

// Computed filtered data
const tableData = computed(() => {
  if (!searchQuery.value || !selectedColumn.value) {
    return rawTableData.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return rawTableData.value.filter(row => {
    const cellValue = row[selectedColumn.value]
    if (cellValue === null || cellValue === undefined) return false
    return String(cellValue).toLowerCase().includes(query)
  })
})

const pagination = ref({
  page: 1,
  limit: 50,
  total: 0
})

const dialogVisible = ref(false)
const dialogMode = ref('add') // 'add' or 'edit'
const formData = ref({})

const loadSchema = async () => {
  try {
    const response = await getTableSchema(schema.value, tableName.value)
    console.log('Schema response:', response)
    columns.value = response.data.columns
  } catch (error) {
    console.error('Schema error:', error)
    ElMessage.error('Ошибка загрузки схемы таблицы')
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit
    }
    
    const response = await getTableData(schema.value, tableName.value, params)
    rawTableData.value = response.data
    
    const paginationData = response.pagination
    pagination.value = {
      page: Number(paginationData.page),
      limit: Number(paginationData.limit),
      total: Number(paginationData.total),
      totalPages: Number(paginationData.totalPages)
    }
  } catch (error) {
    console.error('Data error:', error)
    ElMessage.error('Ошибка загрузки данных')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogMode.value = 'add'
  formData.value = {}
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogMode.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleSave = async () => {
  try {
    if (dialogMode.value === 'add') {
      await createRow(schema.value, tableName.value, formData.value)
      ElMessage.success('Запись добавлена')
    } else {
      const id = formData.value[primaryKey.value]
      await updateRow(schema.value, tableName.value, id, formData.value)
      ElMessage.success('Запись обновлена')
    }
    
    dialogVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('Ошибка сохранения')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить эту запись?',
      'Подтверждение',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }
    )
    
    const id = row[primaryKey.value]
    await deleteRow(schema.value, tableName.value, id)
    ElMessage.success('Запись удалена')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Ошибка удаления')
    }
  }
}

const formatValue = (value) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? 'Да' : 'Нет'
  if (typeof value === 'object') return JSON.stringify(value)
  return value
}

onMounted(async () => {
  await loadSchema()
  await loadData()
})
</script>

<style scoped>
.table-editor {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filters {
  display: flex;
  align-items: center;
}
</style>
