<template>
  <div class="q-pa-md row justify-center items-center full-height">
    <q-card class="q-pa-lg" style="min-width: 500px;">
      <q-card-section class="text-center" style="margin-top: -20px;">
        <div class="text-h6 text-weight-bold text-primary">用戶註冊</div>

      </q-card-section>

      <q-form @submit.prevent="register" class="q-gutter-md">
        <q-card-section>
          <q-input
            filled
            v-model="userForm.userName"
            label="帳號"
            bottom-slots
            :rules="[val=>!!val||'帳號為必填']"
          />

          <q-input
            filled
            v-model="userForm.userPwd"
            type="password"
            label="密碼"
            :rules="[val => !!val || '密碼為必填']"
            bottom-slots
          />

          <q-input
            filled
            v-model="userForm.userEmail"
            type="email"
            label="Email"
            :rules="[val => !!val || 'Email 為必填']"
            bottom-slots
          />

          <q-input
            filled
            v-model="userForm.userBirthDate"
            type="date"
            label="生日"
            :rules="[val => !!val || '請選擇生日']"
            bottom-slots
          />

          <q-input
            filled
            v-model="userForm.userPhone"
            type="tel"
            label="手機號碼"
            :rules="[val => !!val || '手機號碼必填']"
            bottom-slots
          />

          <q-input
            filled
            v-model="userForm.userIdCard"
            label="身分證字號"
            :rules="[val => !!val || '身分證字號必填']"
            bottom-slots
          />
          <q-btn
          @click="showUploadDialog = true"
          color="secondary"
          push
          label="批次註冊"
          class="q-mt-sm"
        />
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            type="submit"
            color="primary"
            class="full-width"
            size="lg"
            label="註冊"
            style="margin-top: -20px;"
          />

        </q-card-actions>
      </q-form>

      <!-- 批次註冊對話框 -->
      <q-dialog v-model="showUploadDialog">
        <q-card style="min-width: 500px">
          <q-card-section class="row items-center">
            <div class="text-h6">批次註冊</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <q-file
              v-model="excelFile"
              label="上傳 Excel 檔案"
              filled
              accept=".xlsx, .xls"
              @update:model-value="parseExcel"
              hint="請上傳包含必要欄位的 Excel 檔案"
            >
            <!-- 這是插槽 可以塞圖片 -->
              <template v-slot:append>
                <q-icon name="upload_file" />
              </template>
            </q-file>

            <!-- 預覽數據 -->
            <div v-if="showPreview" class="q-mt-md">
              <div class="text-subtitle1 q-mb-sm">預覽數據 (共 {{ previewData.length }} 筆)</div>
              <q-table
                :rows="previewData"
                :columns="[
                  { name: 'userName', label: '帳號', field: 'userName' },
                  { name: 'userEmail', label: 'Email', field: 'userEmail' },
                  { name: 'userPhone', label: '手機號碼', field: 'userPhone' },
                  { name: 'userIdCard', label: '身分證字號', field: 'userIdCard' },
                  { name: 'userBirthDate', label: '生日', field: 'userBirthDate' }
                ]"
                dense
                :rows-per-page-options="[5]"
                :pagination="{ rowsPerPage: 5 }"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" color="primary" v-close-popup />
            <q-btn
              flat
              label="確認上傳"
              color="primary"
              @click="uploadData"
              :disable="!previewData.length"
              :loading="uploading"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../boot/axios'
import * as XLSX from 'xlsx'
import { useRouter } from 'vue-router'


const router = useRouter()


const userForm = ref({
  userName: '',
  userPwd: '',
  userPhone: '',
  userEmail: '',
  userIdCard: '',
  userBirthDate: ''
})

// 批次註冊相關
const showUploadDialog = ref(false)
const excelFile = ref(null)
const previewData = ref([])
const showPreview = ref(false)
const uploading = ref(false)

// 單一註冊
const register = async () => {
  try {
    await api.post("/users/register", userForm.value)
    alert("註冊成功！")

    router.push('/user/all')
  } catch (error) {
    console.error("註冊失敗:", error)
    alert("註冊失敗，請稍後再試")
  }
}

// 解析 Excel
const parseExcel = async () => {
  if (!excelFile.value) return

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // 轉換為 JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // 驗證並格式化數據
      previewData.value = jsonData.map(row => ({
        userName: row.userName || row['帳號'] || '',
        userPwdHash: row.userPwdHash || row['密碼'] || '',
        userPhone: row.userPhone || row['手機號碼'] || '',
        userEmail: row.userEmail || row['Email'] || '',
        userIdCard: row.userIdCard || row['身分證字號'] || '',
        userBirthDate: row.userBirthDate || row['生日'] || ''
      }))
      showPreview.value = true
    }

    reader.readAsArrayBuffer(excelFile.value)
  } catch (error) {
    console.error('解析失敗:', error)
    alert('檔案解析失敗，請確認格式是否正確')
  }
}

// 上傳批次數據
const uploadData = async () => {
  if (!previewData.value.length) return

  uploading.value = true
  try {
    console.log('批次註冊數據:', previewData.value)
    const {data} = await api.post('/users/batchAddUser', previewData.value)
    console.log('批次註冊回應:', data.data)
    alert(`批次註冊成功！共註冊 ${previewData.value.length} 筆資料`)
    router.push('/user/all')


    // 重置所有相關狀態
    showUploadDialog.value = false
    showPreview.value = false
    excelFile.value = null
    previewData.value = []
  } catch (error) {
    console.error('批次註冊失敗:', error)
    alert('批次註冊失敗，請稍後再試')
  } finally {
    uploading.value = false
  }
}
</script>
