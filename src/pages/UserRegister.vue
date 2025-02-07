<template>
  <div class="q-pa-md row justify-center items-center full-height">
    <q-card class="q-pa-lg " style="min-width: 500px;">
      <q-card-section class="text-center"  style="margin-top: -20px;">
        <div class="text-h6 text-weight-bold text-primary">用戶註冊</div>
      </q-card-section>

      <q-form @submit.prevent="register" class="q-gutter-md">
        <q-card-section  >
          <q-input
            filled
            v-model="userForm.userName"
            label="帳號"
            bottom-slots
            :rules="[val=>!!val||'帳號為必填']"
          >

          </q-input>

          <q-input
            filled
            v-model="userForm.userPwd"
            type="password"
            label="密碼"
            :rules="[val => !!val || '密碼為必填']"
            bottom-slots
          >

          </q-input>

          <q-input
            filled
            v-model="userForm.userEmail"
            type="email"
            label="Email"
            :rules="[val => !!val || 'Email 為必填']"
            bottom-slots
          >

          </q-input>

          <q-input
            filled
            v-model="userForm.userBirthDate"
            type="date"
            label="生日"
            :rules="[val => !!val || '請選擇生日']"
            bottom-slots
          >

          </q-input>

          <q-input
            filled
            v-model="userForm.userPhone"
            type="tel"
            label="手機號碼"
            :rules="[val => !!val || '手機號碼必填']"
            bottom-slots
          >

          </q-input>

          <q-input
            filled
            v-model="userForm.userIdCard"
            label="身分證字號"
            :rules="[val => !!val || '身分證字號必填']"
            bottom-slots
          >
          </q-input>
        </q-card-section>

        <q-card-actions align="center" >
          <q-btn
            type="submit"
            color="primary "
            class="full-width "
            size="lg"
            label="註冊"
            style="margin-top: -20px;"

          />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '../boot/axios';

// 定義表單資料
const userForm = ref({
  userName: '',
  userPwd: '',
  userPhone: '',
  userEmail: '',
  userIdCard: '',
  userBirthDate: ''
})

// 註冊請求
const register = async () => {
  try {
    const response = await api.post("/users/register", userForm.value)
    console.log("後端回應:", response.data.data)
    alert("註冊成功！")
  } catch (error) {
    console.error("註冊失敗:", error)
    alert("註冊失敗，請稍後再試")
  }
}
</script>
