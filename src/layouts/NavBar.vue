<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-toolbar-title class="text-h5">
        我的網站
      </q-toolbar-title>

      <q-tabs align="right">
        <q-route-tab to="/" label="首頁" />
        <q-route-tab to="/register" label="創建會員" />
        <q-route-tab to="/user/all" label="會員列表" />
      </q-tabs>
    </q-toolbar>
  </q-header>
</template>

<script setup>
</script>
