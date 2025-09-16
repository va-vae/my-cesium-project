<template>
  <div>
    <div ref="chartRef" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup lang="ts">
  import * as echarts from 'echarts';
  import { ref, onMounted } from 'vue';

  interface Props {
    optionData: object
  }
  let props = defineProps({
    optionData: {
      type: Object,
      default: () => {},
    }
  })
  let chartRef = ref(null);
  let chart = ref();

  onMounted(() => {
    init();
  })

  let init = () => {
    chart.value = echarts.init(chartRef.value);
    chart.value.setOption(props.optionData)
  }
</script>

<style scoped lang="scss"></style>