<template>
  <div ref="mapContent" style="width: 100%; height: 600px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import sichuan from '@/assets/mapJson/sichuan.json'

// 1. 数据预处理
const allData = sichuan.features.map(item => ({
  name: item.properties.name,
  code: item.properties.adcode,
  value: Math.random() * 100 // 添加随机值用于演示颜色映射
}))

// 2. 声明ref
const myChart = ref<echarts.ECharts>()
const mapContent = ref<HTMLElement>()

// 3. 初始化图表
const initChart = (geoJson: any, name: string) => {
  if (!mapContent.value) return
  
  try {
    // 3.1 初始化实例
    myChart.value = echarts.init(mapContent.value)
    
    // 3.2 注册地图
    echarts.registerMap(name, geoJson)
    console.log('地图数据:', geoJson) // 调试用
    
    // 3.3 设置配置项
    myChart.value.setOption({
      tooltip: {
        show: true,
        formatter: (params: any) => 
          params.data ? `${params.name}: ${params.data.value.toFixed(2)}` : params.name
      },
      visualMap: {
        type: 'continuous',
        min: 0,
        max: 100,
        inRange: {
          color: ['#edfbfb', '#b7d6f3', '#40a9ed', '#3598c1', '#215096']
        },
        textStyle: {
          color: '#fff'
        }
      },
      series: [{
        type: 'map',
        map: name,
        data: allData,
        label: {
          show: true,
          color: '#333',
          fontSize: 10
        },
        emphasis: {
          label: {
            show: true,
            color: '#b00'
          },
          itemStyle: {
            areaColor: '#a5d8ff'
          }
        },
        itemStyle: {
          areaColor: '#e7f5ff',
          borderColor: '#748bac'
        }
      }]
    })
    
    // 3.4 添加窗口resize监听
    window.addEventListener('resize', handleResize)
  } catch (err) {
    console.error('地图初始化失败:', err)
  }
}

// 4. 响应式调整
const handleResize = () => {
  myChart.value?.resize()
}

// 5. 生命周期
onMounted(() => {
  initChart(sichuan, 'sichuan')
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart.value?.dispose()
})
</script>

<style scoped>
/* 确保容器可见 */
#map-container {
  background: #f0f2f5;
  border-radius: 4px;
}
</style>