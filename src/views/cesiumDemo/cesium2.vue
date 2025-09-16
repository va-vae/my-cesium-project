<template>
  <div ref="cesiumContainer2"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

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
  addOSMBuildings();
  addBuildingGeoJSON();
}
// 添加OSM建筑
const addOSMBuildings = async () => {
  if(!cesiumContainer2.value) return;
  const buildingsTileset = await Cesium.createOsmBuildingsAsync();
  viewer.value.scene.primitives.add(buildingsTileset);
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

onMounted(() => {
  initializeViewer()
}),
onUnmounted(() => {
  if (viewer.value && !viewer.value.isDestroyed()) {
    viewer.value.destroy();
  }
});
</script>

<style scoped lang="scss"></style>