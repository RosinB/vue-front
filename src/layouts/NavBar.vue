<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title class="text-h5">
       會員管理
      </q-toolbar-title>

      <q-tabs align="right">
        <q-route-tab :to="{ name: '活動列表' }" label="首頁" />

        <!-- 未登入才顯示 -->
        <template v-if="!authStore.isLoggedIn">
          <q-route-tab :to="{ name: '註冊' }" label="創建會員" />
          <q-route-tab :to="{ name: '登入' }" label="登入" />
        </template>

        <!-- 已登入才顯示 -->
        <template v-if="authStore.isLoggedIn">
          <q-route-tab v-if="authStore.hasRole('ADMIN')" :to="{ name: '使用者列表' }" label="會員列表" />
          <q-route-tab v-if="authStore.hasRole('ADMIN') || authStore.hasRole('STAFF')" :to="{ name: '審核列表' }"
            label="審核申請" />
          <q-route-tab :to="{ name: '使用者管理' }" label="使用者管理" />
          <q-btn flat label="登出" @click="handleLogout" />
        </template>
      </q-tabs>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/autoStore';

const authStore = useAuthStore(); // ✅ 使用 Pinia

const router = useRouter();





const handleLogout = () => {
  // 清除 localStorage 中的資料
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  authStore.logout();

  router.push({ name: '登入' });
  // 導向登入頁面
};
</script>
