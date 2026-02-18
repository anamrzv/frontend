<template>
  <div class="dashboard">
    <!-- Schema Selector -->
    <div style="margin-bottom: 20px;">
      <el-select 
        v-model="selectedSchema" 
        placeholder="Выберите схему"
        @change="onSchemaChange"
        style="width: 300px;"
      >
        <el-option
          v-for="schema in schemas"
          :key="schema"
          :label="schema"
          :value="schema"
        />
      </el-select>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#409EFF">
              <Grid />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.tableCount }}</div>
              <div class="stat-label">Таблиц</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Недавние таблицы</span>
              <el-button text @click="$router.push('/tables')">Все таблицы</el-button>
            </div>
          </template>
          <el-table :data="recentTables" style="width: 100%">
            <el-table-column prop="name" label="Таблица" />
            <el-table-column label="Действия" width="100">
              <template #default="{ row }">
                <el-button text type="primary" @click="openTable(row.name)">
                  Открыть
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Grid, Document, Connection, Calendar, Plus, Search, TrendCharts } from '@element-plus/icons-vue'
import { getSchemasList, getTablesList } from '@/api/tables'
import { useSchemaStore } from '@/stores/schema'

const router = useRouter()
const schemaStore = useSchemaStore()

const schemas = ref([])
const selectedSchema = ref(schemaStore.selectedSchema)

const stats = ref({
  tableCount: 0
})

const recentTables = ref([])

const loadSchemas = async () => {
  try {
    const response = await getSchemasList()
    schemas.value = response.data
    if (!response.data.includes(selectedSchema.value)) {
      selectedSchema.value = response.data[0] || 'public'
    }
  } catch (error) {
    console.error('Error loading schemas:', error)
  }
}

// Helper function to log table access
const logTableAccess = (tableName) => {
  // Validate tableName
  if (!tableName || tableName === 'undefined' || tableName === 'null') {
    console.warn('Invalid table name:', tableName)
    return
  }

  const key = `table_access_${selectedSchema.value}`
  let history = []
  
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      history = JSON.parse(stored)
      // Clean up invalid entries
      history = history.filter(t => t && t !== 'undefined' && t !== 'null' && typeof t === 'string')
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
  } catch (e) {
    console.error('Error writing to localStorage:', e)
  }
}

const loadData = async () => {
  console.log('Dashboard: loadData called')
  try {
    const response = await getTablesList(selectedSchema.value)
    const allTables = response.data
    stats.value.tableCount = allTables.length
    
    // Get access history from localStorage
    const key = `table_access_${selectedSchema.value}`
    let history = []
    
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        history = JSON.parse(stored)
        // Clean up invalid entries
        history = history.filter(t => t && t !== 'undefined' && t !== 'null' && typeof t === 'string')
        // Save cleaned history back
        localStorage.setItem(key, JSON.stringify(history))
      }
      console.log('Dashboard: cleaned history:', history)
    } catch (e) {
      console.error('Error reading localStorage:', e)
    }
    
    // Sort tables by access history
    const sorted = allTables.sort((a, b) => {
      const aIndex = history.indexOf(a.name)  // Changed from a.table_name to a.name
      const bIndex = history.indexOf(b.name)  // Changed from b.table_name to b.name
      
      // If both in history, sort by history position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }
      
      // If only one in history, it comes first
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      
      // Otherwise keep original order
      return 0
    })
    
    console.log('Dashboard: sorted tables:', sorted.slice(0, 5).map(t => t.name))
    recentTables.value = sorted.slice(0, 5)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

const onSchemaChange = () => {
  schemaStore.setSchema(selectedSchema.value)
  loadData()
}

const openTable = (tableName) => {
  logTableAccess(tableName)
  router.push(`/table/${selectedSchema.value}/${tableName}`)
}

onMounted(async () => {
  await loadSchemas()
  await loadData()
})

// Refresh data when returning to dashboard
onActivated(async () => {
  await loadData()
})

// Watch for table access updates from other components
watch(() => schemaStore.tableAccessUpdated, async () => {
  await loadData()
})
</script>

<style scoped>
.dashboard {
  width: 100%;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 100%;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-actions .el-button {
  width: 100%;
}
</style>
