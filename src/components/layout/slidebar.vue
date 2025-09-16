<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      :collapse="isCollapse"
      :unique-opened="true"
      router
      @select="handleSelect"
    >
      <template v-for="(item, index) in filteredRoutes" :key="item.path">
        <!-- 有子路由的菜单项 (使用 el-sub-menu) -->
        <el-sub-menu 
          v-if="item.children && item.children.length > 0"
          :index="item.path"
        >
          <template #title>
            <span>{{ item.meta?.name || item.name }}</span>
          </template>
          
          <!-- 子菜单项 -->
          <el-menu-item 
            v-for="child in item.children" 
            :key="child.path" 
            :index="child.path"
          >
            {{ child.meta?.name || child.name }}
          </el-menu-item>
        </el-sub-menu>

        <!-- 没有子路由的普通菜单项 -->
        <el-menu-item 
          v-else 
          :index="item.path"
        >
          <span>{{ item.meta?.name || item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import router from '@/router'

const route = useRoute()
const vueRouter = useRouter()

// 过滤掉 hidden 为 true 的路由
const filteredRoutes = computed(() => {
  return router.options.routes.filter(item => !item.hidden)
})

// 当前激活的菜单（根据当前路由自动计算）
const activeMenu = ref('')

// 是否折叠菜单
const isCollapse = ref(false)

// 监听路由变化，更新激活菜单
onMounted(() => {
  updateActiveMenu()
})

// 更新激活的菜单项
const updateActiveMenu = () => {
  activeMenu.value = route.path
}

// 菜单选择事件处理
const handleSelect = (index: string) => {
  vueRouter.push(index)
}
</script>

<style scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
}

/* 菜单项样式 */
:deep(.el-sub-menu__title),
:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: #263445;
}

:deep(.el-menu-item.is-active) {
  background-color: #1890ff;
  color: #fff;
}
</style>