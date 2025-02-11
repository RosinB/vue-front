<template>
  <q-dialog v-model="dialogModel" persistent>
    <q-card class="q-pa-md" style="min-width: 500px">
      <!-- 標題區塊 -->
      <q-card-section class="text-h6">
        編輯會員資料
      </q-card-section>

      <!-- 表單區塊 -->
      <q-card-section class="q-gutter-md">
        <!-- 使用者名字輸入框 -->
        <q-input
          v-model="localUserData.userName"
          label="使用者名字"
          filled
          :rules="[val => !!val || '請輸入使用者名字']"
        />

        <!-- 使用者電話輸入框 -->
        <q-input
          v-model="localUserData.userPhone"
          label="使用者電話"
          filled
          mask="(###) ###-####"
          :rules="[val => !!val || '請輸入電話號碼']"
        />

        <!-- 使用者信箱輸入框 -->
        <q-input
          v-model="localUserData.userEmail"
          label="使用者信箱"
          filled
          type="email"
          :rules="[
            val => !!val || '請輸入電子信箱',
            val => /^[^@]+@[^@]+\.[^@]+$/.test(val) || '請輸入有效的電子信箱'
          ]"
        />
      </q-card-section>

      <!-- 按鈕區塊 -->
      <q-card-actions align="right" class="q-gutter-sm">
        <q-btn flat label="取消" @click="closeDialog" color="grey" />
        <q-btn label="刪除" @click="deleteUser" color="red" />
        <q-btn label="儲存" @click="handleSave" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  userData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'delete'])

// 本地數據，避免直接修改 props
const localUserData = ref({ ...props.userData })

// 對話框雙向綁定
const dialogModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 監聽外部數據變化
watch(
  () => props.userData,
  (newValue) => {
    localUserData.value = { ...newValue }
  }
)

// 關閉對話框
const closeDialog = () => {
  dialogModel.value = false
}

// 處理保存
const handleSave = () => {
  emit('save', localUserData.value)
  closeDialog()
}

const deleteUser = () => {
    // 發送 'delete' 事件給父組件，並傳遞要刪除的用戶數據
  emit('delete', localUserData.value)
  closeDialog()
}
</script>
