<template>
  <div class="tables-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Список таблиц</span>
          <el-input
            v-model="searchQuery"
            placeholder="Поиск таблиц..."
            style="width: 300px;"
            :prefix-icon="Search"
            clearable
          />
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="filteredTables"
        style="width: 100%"
        @row-click="handleRowClick"
        class="clickable-table"
      >
        <el-table-column prop="table_name" label="Таблица" width="300">
          <template #default="{ row }">
            <el-icon><Grid /></el-icon>
            <span style="margin-left: 10px;">{{ row.name }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="table_schema" label="Схема" width="150">
          <template #default="{ row }">
            <el-icon><Grid /></el-icon>
            <span style="margin-left: 10px;">{{ row.schema }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Действия" width="200">
          <template #default="{ row }">
            <el-button
              type="primary"
              text
              @click.stop="openTable(row.schema, row.name)"
            >
              <el-icon><Edit /></el-icon> Редактировать
            </el-button>
            <el-button
              type="info"
              text
              @click.stop="viewAnalytics(row.name)"
            >
              <el-icon><TrendCharts /></el-icon> Аналитика
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Grid, Edit, TrendCharts } from '@element-plus/icons-vue'
import { getTablesList } from '@/api/tables'
import { ElMessage } from 'element-plus'

const router = useRouter()

const loading = ref(false)
const searchQuery = ref('')
const tables = ref([])

const filteredTables = computed(() => {
  if (!searchQuery.value) return tables.value
  
  return tables.value.filter(table =>
    table.table_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loadTables = async () => {
  loading.value = true
  try {
    const response = await getTablesList()
    tables.value = response.data
  } catch (error) {
    ElMessage.error('Ошибка загрузки таблиц')
    console.error('Error loading tables:', error)
  } finally {
    loading.value = false
  }
}

const openTable = (schema, tableName) => {
  router.push(`/table/${schema}/${tableName}`)
}

// const viewAnalytics = (schema, tableName) => {
//   router.push(`/analytics/${schema}/${tableName}`)
// }

const handleRowClick = (row) => {
  openTable(row.schema, row.name)
}

onMounted(() => {
  loadTables()
})
</script>

<style scoped>
.tables-list {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clickable-table :deep(.el-table__row) {
  cursor: pointer;
}

.clickable-table :deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>
