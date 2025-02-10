<template>
  <div>
    <q-table title="圖片列表" :rows="picList" :columns="columns" row-key="eventId" bordered flat>

      <template v-slot:body-cell-picEventList="props">
        <q-td :props="props">
          <q-img
            :src="props.row.picEventList"
            style="height: 100px; max-width: 150px"
            fit="contain"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-picEventSection="props">
        <q-td :props="props">
          <q-img
            :src="props.row.picEventSection"
            style="height: 100px; max-width: 150px"
            fit="contain"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-picEventTicket="props">
        <q-td :props="props">
          <q-img
            :src="props.row.picEventTicket"
            style="height: 100px; max-width: 150px"
            fit="contain"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../boot/axios'

const picList = ref([])
const columns = ref([
  {
    name: 'eventId',
    label: '圖片ID',
    field: 'picId',
  },
  {
    name: 'picEventList',
    label: '圖片一號',
    field: 'picEventList',
  },
  {
    name: 'picEventSection',
    label: '圖片二號',
    field: 'picEventSection',
  },
  {
    name: 'picEventTicket',
    label: '圖片三號',
    field: 'picEventTicket',
  },
])

const fetchPicList = async () => {
  try {
    const { data } = await api.get('/event/allpic')
    picList.value = data.data
    console.log('回傳資料', picList.value)
  } catch (error) {
    console.error('API 錯誤:', error)
  }
}

onMounted(() => {
  fetchPicList()
})
</script>

<style scoped></style>
