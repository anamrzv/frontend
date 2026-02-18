<template>
  <div class="tables-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Список таблиц</span>
          <div style="display: flex; gap: 10px; align-items: center;">
            <el-input
              v-model="searchQuery"
              placeholder="Поиск таблиц..."
              style="width: 300px;"
              :prefix-icon="Search"
              clearable
            />
          </div>
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
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Grid, Edit, TrendCharts } from '@element-plus/icons-vue'
import { getTablesList } from '@/api/tables'
import { useSchemaStore } from '@/stores/schema'
import { ElMessage } from 'element-plus'

const router = useRouter()
const schemaStore = useSchemaStore()

const loading = ref(false)
const searchQuery = ref('')
const tables = ref([])

const filteredTables = computed(() => {
  if (!searchQuery.value) return tables.value
  
  const query = searchQuery.value.toLowerCase()
  return tables.value.filter(table =>
    table.name.toLowerCase().includes(query)
  )
})

const loadTables = async () => {
  loading.value = true
  try {
    const response = await getTablesList(schemaStore.selectedSchema)
    tables.value = response.data
  } catch (error) {
    ElMessage.error('Ошибка загрузки таблиц')
    console.error('Error loading tables:', error)
  } finally {
    loading.value = false
  }
}

// Helper function to log table access
const logTableAccess = (schema, tableName) => {
  const key = `table_access_${schema}`
  let history = []
  
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      history = JSON.parse(stored)
    }
  } catch (e) {
    console.error('Error reading localStorage:', e)
  }
  
  // Remove if exists and add to beginning (most recent)
  history = history.filter(t => t !== tableName)
  history.unshift(tableName)
  
  // Keep only last 20
  history = history.slice(0, 20)
  
  try {
    localStorage.setItem(key, JSON.stringify(history))
    // Trigger update in other components
    schemaStore.triggerTableAccessUpdate()
  } catch (e) {
    console.error('Error writing to localStorage:', e)
  }
}

const openTable = (schema, tableName) => {
  logTableAccess(schema, tableName)
  router.push(`/table/${schema}/${tableName}`)
}

const handleRowClick = (row) => {
  logTableAccess(schemaStore.selectedSchema, row.name)
  router.push(`/table/${schemaStore.selectedSchema}/${row.name}`)
}

onMounted(async () => {
  await loadTables()
})

watch(() => schemaStore.selectedSchema, () => {
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
