<template>

  <div>

    <div class="flex justify-between items-center q-mb-md q-mt-md">
      <div class="text-h4 q-ml-md">會員列表</div>
      <div class="flex items-center gap-4">
        <q-input v-model="userId" label="輸入使用者ID" dense outlined class="w-40" />
        <q-btn label="刪除" color="red" v-model="userId" @click="deleteUser" />
      </div>
    </div>
    <q-table title="" :rows="user" :columns="columns" row-key="userId">

      <template v-slot:body-cell-userIsVerified="props">
        <q-td :props="props">
          {{ props.row.userIsVerified ? "認證" : "沒驗證" }}
        </q-td>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn label="編輯" @click="openEdit(props.row)"></q-btn>
        </q-td>
      </template>
    </q-table>





    <q-dialog v-model="isEditDiaglogOpen">
      <q-card class="q-pa-md" style="min-width: 500px">
        <q-card-section class="text-h6">
          編輯會員資料
        </q-card-section>
        <q-card-section>
          <q-input v-model="edisUserData.userName" label="使用者名字" filled></q-input>
          <q-input v-model="edisUserData.userPhone" label="使用者電話" filled></q-input>
          <q-input v-model="edisUserData.userEmail" label="使用者信箱" filled></q-input>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" v-close-popup />
          <q-btn label="儲存" @click="saveEdisUser" />

        </q-card-actions>

      </q-card>


    </q-dialog>
  </div>


</template>

<script setup>
import { onMounted, ref } from 'vue';
import { api } from '../boot/axios';


const userId = ref()
const user = ref([])
const isEditDiaglogOpen = ref(false)
const edisUserData = ref({})
const columns = [
  { name: 'userId', label: "使用者ID", field: 'userId' },
  { name: 'userName', label: "使用者名字", field: 'userName' },
  { name: 'userBirthDate', label: "生日", field: 'userBirthDate' },
  { name: 'userIdCard', label: "身分證字號", field: 'userIdCard' },
  { name: 'userPhone', label: "電話", field: 'userPhone' },
  { name: "userIsVerified", label: "驗證", field: "userIsVerified" },
  { name: "action", label: "操作", field: "action" }
]
const fetchUserList = async () => {

  try {
    const response = await api.get('/users/all')
    user.value = response.data.data
    console.log(user.value)
  } catch (error) {
    console.log(error);


  }


}
const openEdit = (userData) => {

  edisUserData.value = { ...userData };
  isEditDiaglogOpen.value = true;

}

const saveEdisUser = async () => {

  try {
    await api.post('users/update', edisUserData.value)
    alert("更新成功")
    fetchUserList();
    isEditDiaglogOpen.value = false;
  } catch (error) {
    console.log(error)
  }

}

const deleteUser = async () => {

  if (confirm("確定要刪除嗎?"))
    try {
      await api.post(`/users/delete/${userId.value}`)
      alert("已刪除")
      fetchUserList();
    } catch (error) {
      console.log(error)

    }

}



onMounted(() => {
  fetchUserList();



})

</script>
