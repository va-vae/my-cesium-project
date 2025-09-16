<script lang="ts" setup>
import slidebar from '@/components/layout/slidebar.vue';
</script>

<template>
  <div class="main-container">

    <el-container>
      <el-aside width="200px">
        <slidebar></slidebar>
      </el-aside>
      <el-main>
        <router-view></router-view> 
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.main-container {
  height: 100%;
  height: calc(100vh - 10px);
}
.sidebar {
  height: 100%;
  background-color: #304156;
}
.sidebar-menu {
  height: 100%;
  border-right: none;
}
.sidebar-menu-item {
  height: 40px;
  line-height: 40px;
  color: #fff;
}
.sidebar-menu-item:hover {
  background-color: #203040;
}
</style>