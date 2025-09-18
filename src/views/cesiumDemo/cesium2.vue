<template>
  <div ref="cesiumContainer2"></div>
  <button class="toggle-building" @click="toggleBuilding">切换建筑</button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import { color } from 'echarts';

const cesiumContainer2 = ref<HTMLDivElement>();
const viewer = ref<Cesium.Viewer>();

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NTJmNDI2Yy0wY2NjLTQ5ZjgtYWFlYS03MGUwNmQwZDZlYzIiLCJpZCI6MzQwMzA2LCJpYXQiOjE3NTc1NjAxMDJ9.EjYr3ANoHDPSAjxV8ScW_AVzyNAOqkeX-xA1110IOCw';

// 初始化cesium
const initializeViewer = async() => {
  if(!cesiumContainer2.value) return;

  // 初始化viewer
  viewer.value = new Cesium.Viewer(cesiumContainer2.value, {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    // 优化配置：移除不必要的控件
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
  });

  // 初始化相机
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-104.9965, 39.74248, 4000),
  });
  await addOSMBuildings();
  await addBuildingGeoJSON();
  hideBuildings();
  addNewBuilding();
}
// 添加OSM建筑
let buildingsTileset = ref(null);
const addOSMBuildings = async () => {
  if(!cesiumContainer2.value) return;
  buildingsTileset.value = await Cesium.createOsmBuildingsAsync();
  viewer.value.scene.primitives.add(buildingsTileset.value);
}


// 添加GeoJSON建筑
const addBuildingGeoJSON = async() => {
  // 从cesiumn Ion上拿到geoJson文件资源id，在个人中心找到My Asset
  const geoJSONURL = await Cesium.IonResource.fromAssetId(3733944);
  // 从JeoJSON上创建几何体，并将其固定在地面上
  const geoJSON = await Cesium.GeoJsonDataSource.load(geoJSONURL, { clampToGround: true});
  // 将集合体放入场景中
  const dataSource = await viewer.value.dataSources.add(geoJSON);
  for (const entity of dataSource.entities.values) {
    entity.polygon.classificationType = Cesium.ClassificationType.TERRAIN
  }
  // 移动相机，使多边形进入视野
  viewer.value.flyTo(dataSource)
}

// 5 在该区域中用3d Tiles隐藏不想展示的建筑
const hideBuildings = () => {
  buildingsTileset.value.style = new Cesium.Cesium3DTileStyle({
    show: {
      conditions: [
        // 包含下方id的都隐藏
        ['${elementId} === 332469316', false],
        ['${elementId} === 332469317', false],
        ['${elementId} === 235368665', false],
        ['${elementId} === 530288180', false],
        ['${elementId} === 530288179', false],
        // 不包含的则显示
        [true, true]
      ]
    },
    // 设置颜色
    color: "Boolean(${feature['cesium#color']}) ? color(${feature['cesium#color']}) : color('#ffffff')"
  })
}

// 6 将新建筑添加到场景中
let newBuildingTileset = ref(null)
const addNewBuilding = async() => {
  newBuildingTileset.value = await Cesium.Cesium3DTileset.fromIonAssetId(3753965);
  viewer.value?.scene.primitives.add(newBuildingTileset.value);

  // 移动相机至新建筑处
  viewer.value?.flyTo(newBuildingTileset.value);
}

// 7 添加建筑切换事件
const toggleBuilding = () => {
  newBuildingTileset.value.show = !newBuildingTileset.value.show
}

onMounted(() => {
  initializeViewer()
}),
onUnmounted(() => {
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.destroy();
  }
});
</script>

<style scoped lang="scss">
 .toggle-building { z-index: 5; position: fixed; top: 5px; left: 5px; }
 </style>