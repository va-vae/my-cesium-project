import { createRouter, createWebHashHistory } from 'vue-router'

// 导入路由
import todoList from '@/views/todoList/index.vue'
import weather from '@/views/weather/index.vue'
import cesium1 from '@/views/cesiumDemo/cesium1.vue'

const routes = [
  {
    path: '',
    component: todoList,
    redirect: '/todoList',
    meta: {
      name: '待办事项'
    },
    hidden: true
  },
  {
    path: '/todoList',
    component: todoList,
    meta: {
      name: '待办事项'
    }
  },
  {
    path: '/weather',
    component: weather,
    meta: {
      name: '天气'
    }
  },
  {
    path: '/cesium',
    name: 'cesium',
    meta: {
      name: 'Cesium演示'
    },
    children: [
      {
        path: '/cesium/cesium1', // 注意这里没有斜杠，表示相对路径
        component: () => import('@/views/cesiumDemo/cesium1.vue'),
        meta: {
          name: 'Cesium演示1'
        }
      },
      {
        path: '/cesium/cesium2',
        component: () => import('@/views/cesiumDemo/cesium2.vue'),
        meta: {
          name: 'Cesium演示2'
        }
      }
    ]
  },
]

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 导出路由
export default router
