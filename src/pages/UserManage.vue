<template>
  <div class="q-pa-md">
    <q-card v-if="user.userId" class="user-profile-card">
      <q-card-section>
        <div class="row q-col-gutter-xl">
          <!-- 左側：頭像和基本資訊 -->
          <div class="col-12 col-md-4">
            <div class="profile-left-section">
              <!-- 頭像區域 -->
              <div class="avatar-container">
                <q-avatar size="200px" class="shadow-3">
                  <img :src="user.userImgPath || 'https://cdn.quasar.dev/img/avatar.png'" />
                  <q-file v-model="newAvatar" style="display: none" accept=".jpg,.png,.jpeg"
                    @update:model-value="uploadAvatar" />
                </q-avatar>
                <!-- 更換頭像按鈕 -->
                <q-btn flat round color="primary" class="avatar-edit-btn" icon="edit" @click="triggerFileInput">
                  <q-tooltip>更換頭像</q-tooltip>
                </q-btn>
              </div>

              <!-- 驗證狀態 -->
              <div class="text-center q-mt-lg">
                <q-chip :color="user.userIsVerified ? 'positive' : 'negative'" text-color="white" class="status-chip">
                  <q-icon :name="user.userIsVerified ? 'verified' : 'gpp_bad'" class="q-mr-sm" />
                  {{ user.userIsVerified ? '已驗證帳號' : '未驗證帳號' }}
                </q-chip>
              </div>
            </div>
          </div>

          <!-- 右側：詳細資訊和簡介 -->
          <div class="col-12 col-md-8">
            <div class="profile-right-section">
              <!-- 頁面標題和歷史按鈕 -->
              <div class="row items-center justify-between q-mb-lg">
                <div class="text-h5 text-weight-bold">個人資料</div>
                <q-btn color="info" icon="history" label="查看編輯歷史" @click="showHistory" flat />
              </div>

              <!-- 詳細資訊表單 -->
              <q-form @submit="saveUserInfo" class="q-gutter-md">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input v-model="user.userName" label="用戶名稱" outlined dense>
                      <template v-slot:prepend>
                        <q-icon name="person" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="user.userEmail" label="電子郵件" outlined dense>
                      <template v-slot:prepend>
                        <q-icon name="email" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="user.userPhone" label="電話" outlined dense>
                      <template v-slot:prepend>
                        <q-icon name="phone" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input v-model="user.userBirthDate" label="生日" outlined dense>
                      <template v-slot:prepend>
                        <q-icon name="cake" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12">
                    <q-input v-model="user.userBio" label="個人簡介" type="textarea" outlined autogrow rows="4">
                      <template v-slot:prepend>
                        <q-icon name="description" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- 儲存按鈕 -->
                <div class="text-right q-mt-lg">
                  <q-btn color="primary" label="儲存變更" type="submit" :loading="saving" icon="save" />
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 無資料提示 -->
    <q-card v-else class="text-center q-pa-xl">
      <q-icon name="search" size="100px" color="grey-4" />
      <div class="text-h6 text-grey q-mt-md">請輸入使用者名稱進行搜尋</div>
    </q-card>

    <!-- 歷史紀錄對話框 -->
    <q-dialog v-model="historyDialog">
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center">
          <div class="text-h6">
            <q-icon name="history" class="q-mr-sm" />
            編輯歷史紀錄
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-list separator>
            <q-item v-for="(record, index) in historyRecords" :key="index" class="q-pa-md">
              <q-item-section>
                <q-item-label class="text-weight-medium">
                  修改時間：{{ formatDateTime(record.createAt) }}
                </q-item-label>
                <q-item-label caption class="q-mt-sm">
                  <div v-if="record.userName" class="history-item">
                    <q-icon name="person" size="xs" /> 用戶名稱：{{ record.userName }}
                  </div>
                  <div v-if="record.userEmail" class="history-item">
                    <q-icon name="email" size="xs" /> 電子郵件：{{ record.userEmail }}
                  </div>
                  <div v-if="record.userPhone" class="history-item">
                    <q-icon name="phone" size="xs" /> 電話：{{ record.userPhone }}
                  </div>
                  <div v-if="record.userBirthDate" class="history-item">
                    <q-icon name="cake" size="xs" /> 生日：{{ record.userBirthDate }}
                  </div>
                  <div v-if="record.userBio" class="history-item">
                    <q-icon name="description" size="xs" /> 個人簡介：{{ record.userBio }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <!-- 分頁控制 -->
        <q-card-section class="text-center">
          <q-pagination v-model="currentPage" :max="totalPages" :max-pages="5" boundary-numbers direction-links
            @update:model-value="handlePageChange" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
const router = useRouter()
const userName = ref('ruka')
const user = ref({})
const saving = ref(false)
const newAvatar = ref(null)
const historyDialog = ref(false)
const historyRecords = ref([])
const currentPage = ref(1)
const pageSize = ref(5)
const totalPages = ref(1)

const fetchUser = async () => {
  try {
    console.log(userName.value)

    const { data } = await api.get(`/users/manage/`)
    user.value = data.data
    console.log(user.value)
  } catch (error) {

    console.error('獲取使用者失敗:', error)
  }
}

// 觸發檔案選擇
const triggerFileInput = () => {
  document.querySelector('input[type=file]').click()
}

// 上傳頭像
const uploadAvatar = async (file) => {
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    await api.post(`/users/${user.value.userId}/avatar`, formData)

    await fetchUser()
  } catch (error) {
    console.error('頭像上傳失敗:', error);

  }
}

// 儲存用戶資料
const saveUserInfo = async () => {
  saving.value = true
  try {
    console.log(user.value)
    await api.post(`/users/manage/update/${user.value.userId}`, user.value)
    alert('資料更新成功')

  } catch (error) {

    console.error('資料更新失敗:', error);


  }

  finally {
    saving.value = false
  }
}

// 獲取歷史紀錄
const showHistory = async () => {
  try {
    historyDialog.value = true
    await fetchHistoryRecords()
  } catch (error) {
    console.error('獲取歷史紀錄失敗:', error)
  }
}

// 新增獲取歷史紀錄的函數
const fetchHistoryRecords = async () => {
  try {
    const { data } = await api.get(`/users/manage/history/`, {
      params: {
        page: currentPage.value - 1,
        size: pageSize.value
      }
    })
    historyRecords.value = data.data.content
    totalPages.value = data.data.totalPages
  } catch (error) {
    console.error('獲取歷史紀錄失敗:', error)
  }
}

// 處理頁碼變更
const handlePageChange = async (page) => {
  currentPage.value = page
  await fetchHistoryRecords()
}


// 初始化
onMounted(() => {
  const userId = LocalStorage.getItem('userId')
  if (!userId) {
    alert('請先登入')
    router.push('/login')
  }

  fetchUser();
})

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

</script>

<style scoped>
.user-profile-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.profile-left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.avatar-container {
  position: relative;
  margin-bottom: 20px;
}

.avatar-edit-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-chip {
  font-size: 0.9rem;
  padding: 8px 16px;
}

.profile-right-section {
  padding: 20px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

/* 響應式調整 */
@media (max-width: 600px) {

  .profile-left-section,
  .profile-right-section {
    padding: 10px;
  }
}
</style>
