<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import formComponent from './components/form.vue'

let tableData = ref([]);
let allTableData = ref([]);
// 从本地获取数据
onMounted(() => {
  tableData.value = JSON.parse(localStorage.getItem('todoList') || '[]');
  allTableData.value = tableData.value;
})
// 保存数据到本地
const saveData = () => {
  localStorage.setItem('todoList', JSON.stringify(tableData.value));
  // 保存成功后，刷新页面
  // window.location.reload();
}
let formData = ref({
  catalogCnName: '',
  catalogEnName: '',
  sort: 1,
  status: 1
})
// 打开弹窗
let dialogVisible = ref(false);
// 新增点击
const addData = () => {
  handleType.value = 'add';
  dialogVisible.value = true;
  // 重置formData
  formData.value = {
    catalogCnName: '',
    catalogEnName: '',
    sort: 1,
    status: 1
  }
}
let handleType = ref('add');
// 取消
const handleReset = () => {
  dialogVisible.value = false;
}
// 新增
const handleSubmit = (data) => {
  if(handleType.value == 'add') {
    tableData.value.push(data);
  } else {
    tableData.value[handleIndex.value] = data;
  }
  sortData();
  saveData();
  dialogVisible.value = false;
}
const sortData = () => {
  // tabelData按sort排序
  tableData.value.sort((a, b) => {
    return a.sort - b.sort
  })
}
let handleIndex = ref();
// 编辑
const handleEdit = (index,row) => {
  handleIndex.value = index;
  handleType.value = 'edit';
  formData.value = row;
  dialogVisible.value = true;
}
// 删除
const handleDelete = (index) => {
  ElMessageBox.confirm(
    '是否删除该数据',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    tableData.value.splice(index, 1);
    saveData();
    ElMessage({
        type: 'success',
        message: '删除成功',
      })
  }).catch(() => {

  })
}
const handleClose = () => {
  dialogVisible.value = false;
}
let searchForm = ref({
  catalogName: '',
  status: ''
})
// 搜索
const handleSearch = () => {
  // 搜索
  tableData.value = allTableData.value.filter(item => {
    if(searchForm.value.catalogName) {
      return item.catalogCnName.indexOf(searchForm.value.catalogName) !== -1
    }
    if(searchForm.value.catalogName) {
      return item.catalogEnName.indexOf(searchForm.value.catalogEnName) !== -1
    }
    if(searchForm.value.status) {
      return item.status == searchForm.value.status
    }

    return true
  })
}

// 重置
const resetSearch = () => {
  tableData.value = allTableData.value
}
</script>

<template>
  <div>
    <div class="search" style="width: 100%;">
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="主目录分类名称">
          <el-input v-model="searchForm.catalogName" placeholder="请输入主目录分类名称" />
        </el-form-item>
        <el-form-item label="状态" style="width: 220px;">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="info" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="addData">新增</el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
    <el-table-column
        prop="id"
        label="ID"
        width="180"
      ></el-table-column>
      <el-table-column
        label="主目录分类"
        width="180"
      >
        <template #default="scope">
          {{scope.row.catalogEnName + ',' +scope.row.catalogCnName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="购物网站排序"
        width="180"
      />

      <el-table-column
        prop="status"
        label="状态"
      >
        <template #default="scope">
          {{scope.row.status == 1 ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template #default="scope">
          <el-button type="primary" size="mini" link @click="handleEdit(scope.$index,scope.row)">修改</el-button>
          <el-button type="danger" size="mini" link @click="handleDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <form-component :form="formData" @close="handleClose" :dialog-visible="dialogVisible" @reset="handleReset" @submit="handleSubmit" :handleType="handleType"></form-component>




  
</template>

<style scoped lang="scss">
</style>