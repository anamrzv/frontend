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

  --color-teal: #28aaa0;
  --color-teal-light: #3dc4b9;
  --color-violet: #915af0;
  --color-violet-light: #a97cf4;
  --color-lime: #b9dc50;
  --color-lime-dark: #9ec23a;
  --color-coral: #ff7878;
  --color-coral-dark: #e85f5f;

  /* Element Plus overrides */
  --el-color-primary: #5277F6;
  --el-color-primary-light-3: #7B96F8;
  --el-color-primary-light-5: #a9bcfb;
  --el-color-primary-light-7: #cdd8fd;
  --el-color-primary-light-8: #dce5fe;
  --el-color-primary-light-9: #edf1fe;
  --el-color-primary-dark-2: #3a5ce4;

  --el-color-success: #b9dc50;
  --el-color-success-light-3: #cce673;
  --el-color-success-light-5: #dcee99;
  --el-color-success-light-7: #eaf5bf;
  --el-color-success-light-9: #f5fadf;
  --el-color-success-dark-2: #9ec23a;

  --el-color-danger: #ff7878;
  --el-color-danger-light-3: #ff9c9c;
  --el-color-danger-light-5: #ffbbbb;
  --el-color-danger-light-7: #ffd6d6;
  --el-color-danger-light-9: #ffeeee;
  --el-color-danger-dark-2: #e85f5f;

  --el-color-warning: #915af0;
  --el-color-warning-light-3: #a97cf4;
  --el-color-warning-light-5: #c4a3f7;
  --el-color-warning-light-7: #dcc8fa;
  --el-color-warning-light-9: #f0e8fd;
  --el-color-warning-dark-2: #7a45d8;

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
