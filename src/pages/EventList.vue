<template>
  <div class="q-pa-md">
    <!-- 標題區域 -->
    <div class="text-h5 q-mb-md">活動列表</div>

    <!-- 表格區域 -->
    <q-table :rows="event" :columns="columns" row-key="eventId" :loading="loading" bordered flat
      class="my-sticky-header-table">
      <!-- 載入中動畫 -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary">
          <q-spinner-dots size="50px" color="primary" />
        </q-inner-loading>
      </template>

      <!-- 票圖欄位自定義 -->
      <template v-slot:body-cell-eventTicketPic="props">
        <q-td :props="props">
          <q-img :src="props.row.eventTicketPic" alt="票圖" class="ticket-image" contain
            @click="showImage(props.row.eventTicketPic)" />
        </q-td>
      </template>
    </q-table>

    <!-- 圖片預覽對話框 -->
    <q-dialog v-model="imageDialog">
      <q-card class="image-dialog">
        <q-img :src="selectedImage" />
        <q-card-actions align="right">
          <q-btn flat label="關閉" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios';

const columns = [
  { name: 'eventId', label: 'ID', field: 'eventId', align: 'left', sortable: true },
  { name: 'eventName', label: '活動名稱', field: 'eventName', align: 'left', sortable: true },
  { name: 'eventDate', label: '活動日期', field: 'eventDate', align: 'left', sortable: true },
  { name: 'eventTime', label: '活動時間', field: 'eventTime', align: 'left', sortable: true },
  { name: 'eventLocation', label: '活動地點', field: 'eventLocation', align: 'left', sortable: true },
  { name: 'eventPerformer', label: '表演者', field: 'eventPerformer', align: 'left' },
  { name: 'eventTicketPic', label: '票圖', field: 'eventTicketPic', align: 'center' }
];

// const router = useRouter();
const event = ref([]);
const loading = ref(false);

const fetchEventList = async () => {
  try {
    const { data } = await api.get('/event/eventpic')
    event.value = data.data
    console.log("回傳資料", event.value);

  } catch (error) {
    console.error("API 錯誤:", error);
  } finally {
    loading.value = false;
  }
}

// const addEvent = () => {
//   console.log("新增活動");
//   router.push('/addEvent');
// }

// 圖片預覽相關
const imageDialog = ref(false);
const selectedImage = ref('');

const showImage = (imageUrl) => {
  selectedImage.value = imageUrl;
  imageDialog.value = true;
};

onMounted(() => {
  fetchEventList();
});
</script>

<style scoped>
.my-sticky-header-table {
  /* 設定最大高度，超過時出現滾動條 */
  max-height: 70vh;
}

.ticket-image {
  width: 100px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.2s;
}

.ticket-image:hover {
  transform: scale(1.05);
}

.image-dialog {
  min-width: 300px;
  max-width: 80vw;
}
</style>
