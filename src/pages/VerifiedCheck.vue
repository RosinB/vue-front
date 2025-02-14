<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">帳號驗證審核</div>

    <!-- 審核列表 -->
    <q-table :rows="verificationRequests" :columns="columns" row-key="requestId" v-model:pagination="pagination"
      :loading="loading">
      <!-- 自定義列：狀態 -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="getStatusColor(props.row.status)" text-color="white">
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>

      <!-- 自定義列：操作 -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center">
          <div class="row justify-center q-gutter-md">
            <q-btn color="positive" :label="props.row.status === '審核中' ? '通過' : '已通過'"
              :icon="props.row.status === '審核中' ? 'check_circle' : 'done_all'" :disable="props.row.status !== '審核中'"
              @click="openReviewDialog(props.row, 'APPROVED')" size="sm" class="action-btn" />
            <q-btn color="negative" :label="props.row.status === '審核中' ? '拒絕' : '已拒絕'"
              :icon="props.row.status === '審核中' ? 'cancel' : 'block'" :disable="props.row.status !== '審核中'"
              @click="openReviewDialog(props.row, 'REJECTED')" size="sm" class="action-btn" />
          </div>
        </q-td>
      </template>
    </q-table>

    <!-- 審核對話框 -->
    <q-dialog v-model="reviewDialog">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            {{ reviewAction === 'APPROVED' ? '通過審核' : '拒絕審核' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input v-model="reviewComment" label="審核意見" type="textarea" outlined autogrow />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="grey" v-close-popup />
          <q-btn :label="reviewAction === 'APPROVED' ? '確認通過' : '確認拒絕'"
            :color="reviewAction === 'APPROVED' ? 'positive' : 'negative'" @click="submitReview"
            :loading="submitting" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="text-h6 q-my-md">驗證歷史紀錄</div>
    <q-table :rows="historyRecords" :columns="historyColumns" row-key="requestId" v-model:pagination="historyPagination"
      :loading="historyLoading">
      <!-- 狀態欄位自定義 -->
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip :color="getStatusColor(props.row.status)" text-color="white">
            {{ props.row.status }}
          </q-chip>
        </q-td>
      </template>

      <!-- 審核意見欄位自定義 -->
      <template v-slot:body-cell-comments="props">
        <q-td :props="props">
          <span>{{ props.row.comments || '無審核意見' }}</span>
        </q-td>
      </template>

      <!-- 審核者角色欄位自定義 -->
      <template v-slot:body-cell-reviewerRole="props">
        <q-td :props="props">
          <q-chip dense color="primary" text-color="white">
            {{ props.row.reviewerRole }}
          </q-chip>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

// 表格列定義
const columns = [
  { name: 'requestId', label: '申請編號', field: 'requestId', align: 'left' },
  { name: 'userId', label: '用戶ID', field: 'userId', align: 'left' },
  {
    name: 'requestAt',
    label: '申請時間',
    field: 'requestAt',
    format: (val) => formatDateTime(val)
  },
  { name: 'status', label: '狀態', field: 'status', align: 'center' },
  { name: 'actions', label: '操作', align: 'center' }
]

// 資料相關
const verificationRequests = ref([])
const loading = ref(false)
const pagination = ref({
  rowsPerPage: 10
})

// 審核相關
const reviewDialog = ref(false)
const reviewAction = ref('')
const reviewComment = ref('')
const currentRequest = ref(null)
const submitting = ref(false)

// 歷史紀錄相關
const historyRecords = ref([])
const historyLoading = ref(false)
const historyPagination = ref({
  rowsPerPage: 10
})

// 歷史紀錄表格列定義
const historyColumns = [
  {
    name: 'requestId',
    label: '申請編號',
    field: 'requestId',
    align: 'left',
    sort: 'desc'
  },
  {
    name: 'userId',
    label: '申請者ID',
    field: 'userId',
    align: 'left'
  },
  {
    name: 'requestAt',
    label: '申請時間',
    field: 'requestAt',
    format: (val) => formatDateTime(val)
  },
  {
    name: 'status',
    label: '審核狀態',
    field: 'status',
    align: 'center'
  },
  {
    name: 'reviewerId',
    label: '審核者ID',
    field: 'reviewerId',
    align: 'left'
  },
  {
    name: 'reviewerRole',
    label: '審核者角色',
    field: 'reviewerRole',
    align: 'left'
  },
  {
    name: 'updatedAt',
    label: '審核時間',
    field: 'updatedAt',
    format: (val) => formatDateTime(val)
  },
  {
    name: 'comments',
    label: '審核意見',
    field: 'comments',
    align: 'left'
  }
]

// 獲取審核列表
const fetchVerificationRequests = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/users/verified/all-pending')
    console.log('API回傳資料:', data.data) // 檢查資料
    verificationRequests.value = data.data
  } catch (error) {
    console.error('獲取審核列表失敗:', error)
  } finally {
    loading.value = false
  }
}

// 打開審核對話框
const openReviewDialog = (request, action) => {
  currentRequest.value = request
  reviewAction.value = action
  reviewComment.value = ''
  reviewDialog.value = true
}

// 提交審核結果
const submitReview = async () => {
  if (!currentRequest.value) return

  try {
    submitting.value = true
    const statusMap = {
      'APPROVED': '已通過',
      'REJECTED': '已拒絕'
    }
    await api.post(`/users/verified/review/${currentRequest.value.requestId}`, {
      status: statusMap[reviewAction.value],
      comments: reviewComment.value

    })

    reviewDialog.value = false
    await fetchVerificationRequests()
    await fetchHistoryRecords()
  } catch (error) {
    console.error('提交審核失敗:', error)
    alert('提交審核失敗，請稍後再試')
  } finally {
    submitting.value = false
  }
}

// 格式化日期時間
const formatDateTime = (dateString) => {
  if (!dateString) return '無資料'
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 獲取狀態顏色
const getStatusColor = (status) => {
  switch (status) {
    case '審核中': return 'warning'
    case '已通過': return 'positive'
    case '已拒絕': return 'negative'
    default: return 'grey'
  }
}

// 獲取歷史紀錄
const fetchHistoryRecords = async () => {
  try {
    historyLoading.value = true
    const { data } = await api.get('/users/verified/history')
    console.log('歷史紀錄資料:', data.data)
    historyRecords.value = data.data
  } catch (error) {
    console.error('獲取歷史紀錄失敗:', error)
  } finally {
    historyLoading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchVerificationRequests()
  fetchHistoryRecords()
})
</script>

<style scoped>
.q-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

/* 按鈕樣式 */
.action-btn {
  min-width: 100px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:not(:disabled) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 禁用狀態樣式 */
.action-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 表格對齊 */
:deep(.q-table th) {
  font-weight: 600;
  font-size: 1rem;
}

:deep(.q-table td) {
  padding: 12px 8px;
}
</style>
