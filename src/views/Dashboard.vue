<template>
  <div class="dashboard">
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
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#67C23A">
              <Document />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalRecords }}</div>
              <div class="stat-label">Записей</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#E6A23C">
              <Connection />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.dbSize }}</div>
              <div class="stat-label">Размер БД</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#F56C6C">
              <Calendar />
            </el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ stats.lastUpdate }}</div>
              <div class="stat-label">Последнее обновление</div>
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
            <el-table-column prop="table_name" label="Таблица" />
            <el-table-column prop="row_count" label="Записей" width="100" />
            <el-table-column label="Действия" width="100">
              <template #default="{ row }">
                <el-button text type="primary" @click="openTable(row.table_name)">
                  Открыть
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>Быстрый доступ</span>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus" @click="$router.push('/tables')">
              Новая запись
            </el-button>
            <el-button :icon="Search" @click="$router.push('/tables')">
              Поиск данных
            </el-button>
            <el-button :icon="TrendCharts" @click="$router.push('/analytics')">
              Создать отчет
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Grid, Document, Connection, Calendar, Plus, Search, TrendCharts } from '@element-plus/icons-vue'
import { getTablesList } from '@/api/tables'

const router = useRouter()

const stats = ref({
  tableCount: 0,
  totalRecords: 0,
  dbSize: '0 MB',
  lastUpdate: 'N/A'
})

const recentTables = ref([])

const loadData = async () => {
  try {
    const response = await getTablesList()
    stats.value.tableCount = response.data.length
    recentTables.value = response.data.data.slice(0, 5)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

const openTable = (tableName) => {
  router.push(`/table/${tableName}`)
}

onMounted(() => {
  loadData()
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
