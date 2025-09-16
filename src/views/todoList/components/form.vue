<template>
  <el-dialog
    :title="handleType === 'add' ? '新增' : '修改'"
    v-model="props.dialogVisible"
    @close="handleClose"
    width="50%"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="180px">
      <el-form-item label="主目录分类名称（中文）" prop="catalogCnName">
        <el-input v-model="formData.catalogCnName" placeholder="请输入主目录分类名称（中文）" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="主目录分类名称（英文）" prop="catalogEnName">
        <el-input v-model="formData.catalogEnName" placeholder="请输入主目录分类名称（英文）" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item label="购物网站排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      </el-form>
      <el-form-item>
        <el-button type="primary" @click="handleReset">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </el-form-item>
    </el-dialog>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
const emit = defineEmits(['submit', 'reset']);
const formRef =ref(null);

const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  form: {
    type: Object,
    default: () => ({
      catalogCnName: '',
      catalogEnName: '',
      sort: 1,
      status: 1
    })
  },
  handleType: {
    type: String,
    default: 'add'
  }
})
let formData = ref({});
watch(() => props.form, (newVal) => {
  formData.value = {...newVal};
  
}, {immediate: true})

const rules = ref({
  catalogCnName: [{ required: true, message: '请输入主目录分类名称（中文）', trigger: 'blur' }],
  catalogEnName: [{ required: true, message: '请输入主目录分类名称（英文）', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入购物网站排序', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
})

const submitForm = async () => {
  await formRef.value.validate();
  // 提交数据
  if(props.handleType == 'add') {
    formData.value.id = new Date().getTime();
  }
  emit('submit', formData.value);
}
const handleClose = () => {
  emit("close");

}
const handleReset = () => {
  emit('reset',);
}
</script>


<style scoped lang="scss">
</style>