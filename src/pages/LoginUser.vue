<template>
  <div class="login-container">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="text-h5 q-mb-md">歡迎回來</div>
        <div class="text-subtitle2 text-grey">請登入您的帳號</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input v-model="form.username" label="帳號" :rules="[val => !!val || '請輸入帳號']" outlined dense>
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input v-model="form.password" label="密碼" :type="isPwd ? 'password' : 'text'"
            :rules="[val => !!val || '請輸入密碼']" outlined dense>
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <div class="row items-center justify-between q-mt-md">
            <q-checkbox v-model="form.remember" label="記住我" />
            <q-btn flat color="primary" label="忘記密碼?" />
          </div>

          <q-btn type="submit" color="primary" class="full-width q-mt-lg" :loading="loading" label="登入" />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { api } from '../boot/axios'
import { LocalStorage } from 'quasar'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/autoStore'
const router = useRouter()
const loading = ref(false)
const isPwd = ref(true)

const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const onSubmit = async () => {
  loading.value = true
  try {

    const { data } = await api.get("/users/login", {
      params: {
        userName: form.username,
        passWord: form.password
      }
    })


    LocalStorage.set('token', data.data)

    const payload = JSON.parse(atob(data.data.split('.')[1]))

    LocalStorage.set('userId', payload.userId)
    LocalStorage.set('userName', payload.userName)

    alert('登入成功')
    authStore.login(data.data); // ✅ 透過 Pinia 設定登入狀態

    router.push({ name: '使用者管理' })

  } catch (error) {
    console.error('API 錯誤:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    padding: 16px;
  }
}
</style>
