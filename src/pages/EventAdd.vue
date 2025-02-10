<template>
  <div class="q-pa-md">
    <q-card class="form-card q-pa-lg">
      <q-card-section>
        <div class="text-h5 text-primary q-mb-md">新增演唱會</div>
        <form @submit.prevent="uploadEvent">
          <div class="row q-col-gutter-md">
            <!-- 左側欄位 -->
            <div class="col-12 col-md-6">
              <q-input v-model="event.eventName" label="演唱會名稱" filled :rules="[val => !!val || '請輸入演唱會名稱']"
                class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>

              <q-input v-model="event.eventPerformer" label="表演者" filled :rules="[val => !!val || '請輸入表演者']"
                class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>

              <q-input v-model="event.eventDescription" label="演唱會描述" type="textarea" filled rows="4" class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="description" />
                </template>
              </q-input>
            </div>

            <!-- 右側欄位 -->
            <div class="col-12 col-md-6">
              <q-input v-model="event.eventDate" label="演唱會日期" filled class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="event.eventDate">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="關閉" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="event.eventTime" label="演唱會時間" filled class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="access_time" />
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="event.eventTime">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="關閉" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input v-model="event.eventLocation" label="演唱會地點" filled :rules="[val => !!val || '請輸入演唱會地點']"
                class="q-mb-md">
                <template v-slot:prepend>
                  <q-icon name="location_on" />
                </template>
              </q-input>

              <!-- 票券圖片 -->
              <q-file v-model="selectedFile" label="演唱會票券圖片" filled class="q-mb-md" accept="image/*"
                @update:model-value="handleFileUpload" />

              <!-- 預覽圖片 -->
              <img v-if="previewUrl" :src="previewUrl" alt="預覽圖片" class="preview-img">

              <!-- 上傳按鈕 -->
              <q-btn label="上傳活動" color="primary" type="submit" :loading="loading" />
            </div>
          </div>
        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../boot/axios';

const router = useRouter();
const loading = ref(false);

const event = ref({
  eventPerformer: '',
  eventName: '',
  eventDescription: '',
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
  eventLocation: '',
  eventStatus: '未開始',
  hostId: '1',
  eventType: '演唱會',
});

const selectedFile = ref(null);
const previewUrl = ref(null);

// 處理圖片選擇
const handleFileUpload = (file) => {
  if (file) {
    // 檢查檔案類型
    if (!file.type.match(/image.*/)) {
      alert('請上傳圖片檔案！');
      selectedFile.value = null;
      return;
    }

    // 檢查檔案大小（限制 5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('圖片大小不能超過 5MB！');
      selectedFile.value = null;
      return;
    }

    // 創建預覽
    previewUrl.value = URL.createObjectURL(file);
  } else {
    previewUrl.value = null;
  }
};

// 上傳活動
const uploadEvent = async () => {
  if (!selectedFile.value) {
    alert("請選擇一張圖片！");
    return;
  }

  // 表單驗證
  if (!event.value.eventName || !event.value.eventPerformer ||
    !event.value.eventDate || !event.value.eventLocation) {
    alert("請填寫所有必要欄位！");
    return;
  }

  loading.value = true;
  try {
    // 創建 FormData 對象
    const formData = new FormData();

    // 添加圖片檔案
    formData.append('eventTicketPic', selectedFile.value);

    // 添加其他活動資料
    Object.keys(event.value).forEach(key => {
      formData.append(key, event.value[key]);
    });

    // 發送請求
    await api.post('/event/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });


    alert("活動上傳成功！");
    URL.revokeObjectURL(previewUrl.value);
    router.push({ name: '活動列表' });
  } catch (error) {
    console.error("活動上傳失敗", error);
    alert(error.response?.data?.message || "活動上傳失敗！");
  } finally {
    loading.value = false;
  }
};

// 組件卸載時清理預覽 URL
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.form-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.preview-img {
  max-width: 300px;
  margin-top: 10px;
  border: 1px solid #ddd;
  padding: 5px;
  border-radius: 5px;
}
</style>
