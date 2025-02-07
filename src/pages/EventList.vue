<template>
  <q-page-container>
    <q-table
      title="演唱會列表"
      :rows="event"
      :columns="columns"
      row-key="eventId"
      bordered
      flat
    >
      <template v-slot:body-cell-eventTicketPic="props">
        <q-td :props="props">
          <q-img :src="props.row.eventTicketPic" alt="票圖" class="w-20 h-20 rounded-md" contain />
        </q-td>
      </template>
    </q-table>
  </q-page-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios';

const columns = [
  { name: 'eventId', label: 'ID', field: 'eventId', align: 'left', sortable: true },
  { name: 'eventName', label: '活動名稱', field: 'eventName', align: 'left', sortable: true },
  { name: 'eventDate', label: '活動日期', field: 'eventDate', align: 'left', sortable: true },
  { name: 'eventTime', label: '活動時間', field: 'eventTime', align: 'left', sortable: true },
  { name: 'eventPerformer', label: '表演者', field: 'eventPerformer', align: 'left' },
  { name: 'eventTicketPic', label: '票圖', field: 'eventTicketPic', align: 'center' }
];

const event = ref([]);

const fetchEventList = async () => {
  try {
    const response = await api.get('/event/eventpic')
    event.value = response.data.data
    console.log("回傳資料",event.value);

  } catch (error) {
    console.error("API 錯誤:", error);
  }
}

onMounted(()=>{
  fetchEventList();


});
</script>
