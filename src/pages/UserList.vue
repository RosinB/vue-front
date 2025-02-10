<template>
  <div>
    <!-- 頂部操作區 -->
    <div class="flex justify-between items-center q-mb-md q-mt-md">
      <div class="text-h4 q-ml-md">會員列表</div>
      <div class="flex items-center q-mr-md">
        <q-input
          v-model="userId"
          label="輸入使用者ID"
          dense
          outlined
          class="q-mr-sm"
          style="width: 200px"
          placeholder="請輸入要刪除的ID"
          :rules="[
            val => !!val || '請輸入ID',
            val => validateUserId(val) || '此ID不存在'
          ]"
        />
        <q-btn
          label="刪除"
          color="red"
          @click="deleteUser"
          :disable="!userId"
          style="margin-top: -23px;"
        >
          <q-tooltip>刪除使用者</q-tooltip>
        </q-btn>
      </div>
    </div>

    <!-- 使用者列表表格 -->
    <q-table
      :rows="users"
      :columns="columns"
      row-key="userId"
      :loading="loading"
    >
      <!-- 驗證狀態列 -->
      <template v-slot:body-cell-userIsVerified="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.userIsVerified ? 'positive' : 'negative'"
            text-color="white"
            :label="props.row.userIsVerified ? '已認證' : '未認證'"
          />
        </q-td>
      </template>

      <!-- 操作列 -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            @click="openEdit(props.row)"
          >
            <q-tooltip>編輯使用者</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- 無數據時顯示 -->
      <template v-slot:no-data>
        <div class="full-width row flex-center q-pa-md text-grey-8">
          沒有資料
        </div>
      </template>
    </q-table>

    <!-- 編輯會員資料的對話框 -->
    <q-dialog v-model="isEditDialogOpen" persistent>
      <q-card class="q-pa-md" style="min-width: 500px">
        <!-- 標題區塊 -->
        <q-card-section class="text-h6">
          編輯會員資料
        </q-card-section>

        <!-- 表單區塊 -->
        <q-card-section class="q-gutter-md">
          <!-- 使用者名字輸入框 -->
          <q-input
            v-model="editUserData.userName"
            label="使用者名字"
            filled
            :rules="[val => !!val || '請輸入使用者名字']"
          />

          <!-- 使用者電話輸入框 -->
          <q-input
            v-model="editUserData.userPhone"
            label="使用者電話"
            filled
            mask="(###) ###-####"
            :rules="[val => !!val || '請輸入電話號碼']"
          />

          <!-- 使用者信箱輸入框 -->
          <q-input
            v-model="editUserData.userEmail"
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
          <q-btn flat label="取消" v-close-popup color="grey" />
          <q-btn label="儲存" @click="saveEditUser" color="primary" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUsers } from '../hooks/useUsers'

// 表格列定義
const columns = [
  { name: 'userId', label: "使用者ID", field: 'userId', sortable: true },
  { name: 'userName', label: "使用者名字", field: 'userName', sortable: true },
  { name: 'userBirthDate', label: "生日", field: 'userBirthDate', sortable: true },
  { name: 'userIdCard', label: "身分證字號", field: 'userIdCard' },
  { name: 'userPhone', label: "電話", field: 'userPhone' },
  { name: "userIsVerified", label: "驗證", field: "userIsVerified" },
  { name: "action", label: "操作", field: "action" }
]

// 使用 useUsers hook
const {
  users,
  loading,
  userId,
  isEditDialogOpen,
  editUserData,
  validateUserId,
  fetchUsers,
  deleteUser,
  openEdit,
  saveEditUser
} = useUsers()

onMounted(fetchUsers)
</script>

<style scoped>
.q-table__container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
