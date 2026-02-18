<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import ru from 'element-plus/dist/locale/ru.mjs'

const locale = ru
</script>

<style>
:root {
  --color-primary: #5277F6;
  --color-primary-light: #7B96F8;
  --color-primary-dark: #3a5ce4;
  --color-secondary: #0B1B5B;
  --color-secondary-light: #1a2f7a;

  /* Element Plus overrides */
  --el-color-primary: #5277F6;
  --el-color-primary-light-3: #7B96F8;
  --el-color-primary-light-5: #a9bcfb;
  --el-color-primary-light-7: #cdd8fd;
  --el-color-primary-light-8: #dce5fe;
  --el-color-primary-light-9: #edf1fe;
  --el-color-primary-dark-2: #3a5ce4;

  --el-font-family: 'Poppins', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: #f5f7fa;
}

#app {
  min-height: 100vh;
}

/* Глобальный override Element Plus на Poppins */
.el-button,
.el-input,
.el-input__inner,
.el-select,
.el-table,
.el-dialog,
.el-menu,
.el-menu-item,
.el-tag,
.el-pagination,
.el-form-item__label,
.el-tooltip__popper,
.el-message,
.el-message-box {
  font-family: 'Poppins', sans-serif !important;
}
</style>
