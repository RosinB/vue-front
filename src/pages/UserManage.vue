<template>
  <div class="q-pa-md">
    <!-- 搜尋區域 -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="row items-center">
          <div class="col-12 col-sm-6">
            <q-input
              v-model="userName"
              label="搜尋使用者"
              outlined
              dense
              @keyup.enter="fetchUser"
            >
              <template v-slot:append>
                <q-icon
                  name="search"
                  class="cursor-pointer"
                  @click="fetchUser"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 用戶資料顯示區域 -->
    <q-card v-if="user.userId">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <!-- 左側：頭像和基本資訊 -->
          <div class="col-12 col-md-4">
            <div class="text-center q-mb-md">
              <q-avatar size="200px">
                <img :src="user.userAvatar || 'default-avatar.png'" />
                <q-file
                  v-model="newAvatar"
                  style="display: none"
                  accept=".jpg,.png,.jpeg"
                  @update:model-value="uploadAvatar"
                >
                  <template v-slot:file="{ file }">
                    <img :src="file" />
                  </template>
                </q-file>
              </q-avatar>
              <!-- 更換頭像按鈕 -->
              <div class="q-mt-sm">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  @click="triggerFileInput"
                >
                  <q-tooltip>更換頭像</q-tooltip>
                </q-btn>
              </div>
            </div>

            <!-- 驗證狀態 -->
            <div class="text-center q-mb-md">
              <q-chip
                :color="user.userIsVerified ? 'positive' : 'negative'"
                text-color="white"
              >
                {{ user.userIsVerified ? '已驗證' : '未驗證' }}
              </q-chip>
            </div>

            <!-- 基本資訊卡片 -->
            <q-list bordered padding>
              <q-item>
                <q-item-section>
                  <q-item-label caption>用戶ID</q-item-label>
                  <q-item-label>{{ user.userId }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>註冊時間</q-item-label>
                  <q-item-label>{{ user.userRegdate }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>最後登入</q-item-label>
                  <q-item-label>{{ user.lastLoginTime || '無記錄' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- 右側：詳細資訊和簡介 -->
          <div class="col-12 col-md-8">
            <!-- 詳細資訊表單 -->
            <q-form @submit="saveUserInfo" class="q-gutter-md">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="user.userName"
                    label="用戶名稱"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="user.userEmail"
                    label="電子郵件"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="user.userPhone"
                    label="電話"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="user.userBirthDate"
                    label="生日"
                    outlined
                    dense
                  />
                </div>
                <div class="col-12">
                  <q-input
                    v-model="user.userBio"
                    label="個人簡介"
                    type="textarea"
                    outlined
                    autogrow
                  />
                </div>
              </div>

              <!-- 儲存按鈕 -->
              <div class="text-right q-mt-md">
                <q-btn
                  color="primary"
                  label="儲存變更"
                  type="submit"
                  :loading="saving"
                />
              </div>
            </q-form>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- 無資料提示 -->
    <q-card v-else class="text-center q-pa-lg">
      <q-icon name="search" size="50px" color="grey" />
      <div class="text-h6 text-grey q-mt-sm">請輸入使用者名稱進行搜尋</div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const userName = ref('ruka')
const user = ref({})
const saving = ref(false)
const newAvatar = ref(null)

// 獲取用戶資料
const fetchUser = async () => {
  try {
    console.log(userName.value)

    const { data } = await api.get(`/users/manage/${userName.value}`)
    user.value = data.data
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

    $q.notify({
      type: 'positive',
      message: '頭像更新成功'
    })

    // 重新獲取用戶資料以更新頭像
    await fetchUser()
  } catch (error) {
    console.error('頭像上傳失敗:',error);
    $q.notify({
      type: 'negative',
      message: '頭像上傳失敗'
    })
  }
}

// 儲存用戶資料
const saveUserInfo = async () => {
  saving.value = true
  try {
    console.log(user.value)
    await api.put(`/users/${user.value.userId}`, user.value)
    $q.notify({
      type: 'positive',
      message: '資料更新成功'
    })
  } catch (error) {

    console.error('資料更新失敗:',error);

    $q.notify({
      type: 'negative',
      message: '資料更新失敗'
    })
  }

  finally {
    saving.value = false
  }
}

// 初始化
onMounted(fetchUser)
</script>

<style scoped>
.q-avatar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

