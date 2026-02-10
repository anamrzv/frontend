<template>
  <el-container class="main-layout">
    <!-- Sidebar -->
    <el-aside width="250px" class="sidebar">
      <div class="logo">
        <el-icon><DataAnalysis /></el-icon>
        <span>PostgreSQL UI</span>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/">
          <el-icon><Odometer /></el-icon>
          <span>Дашборд</span>
        </el-menu-item>
        
        <el-menu-item index="/tables">
          <el-icon><Grid /></el-icon>
          <span>Таблицы</span>
        </el-menu-item>
        
        <el-menu-item index="/analytics">
          <el-icon><TrendCharts /></el-icon>
          <span>Аналитика</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main content -->
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <h2>{{ pageTitle }}</h2>
          <div class="header-actions">
            <el-button circle>
              <el-icon><Bell /></el-icon>
            </el-button>
            <el-button circle>
              <el-icon><Setting /></el-icon>
            </el-button>
          </div>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Odometer, Grid, TrendCharts, Bell, Setting, DataAnalysis } from '@element-plus/icons-vue'

const route = useRoute()

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/': 'Дашборд',
    '/tables': 'Таблицы',
    '/analytics': 'Аналитика'
  }
  return titles[route.path] || 'PostgreSQL UI'
})
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.sidebar {
  background-color: #001529;
  color: #fff;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-menu {
  border-right: none;
  background-color: #001529;
}

.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.65);
}

.sidebar-menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.sidebar-menu .el-menu-item.is-active {
  background-color: #1890ff;
  color: #fff;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.main-content {
  background-color: #f5f7fa;
  padding: 24px;
}
</style>
