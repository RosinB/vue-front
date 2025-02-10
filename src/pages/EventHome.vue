<template>
  <div class="q-pa-md">
    <!-- 頂部導航區域 -->
    <div class="row justify-center q-mb-lg">
      <div class="col-12 col-md-8">
          <q-card-section>
            <div class="row justify-center q-gutter-md">
              <q-btn
                :to="{ name: '活動列表' }"
                style="height: 45px"
              >活動列表
              </q-btn>

              <q-btn
                :to="{ name: '圖片列表' }"

                style="height: 45px"
              >
              圖片列表

              </q-btn>
            </div>
          </q-card-section>
      </div>
    </div>

    <!-- 內容顯示區域 -->
    <div class="row justify-center">
      <div class="col-12 col-md-10">
        <q-card class="content-card">
          <q-card-section>
            <router-view />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.content-card {
  min-height: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

/* 動畫相關樣式 */
.animated {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

.fadeIn {
  animation-name: fadeIn;
}

.fadeOut {
  animation-name: fadeOut;
}
</style>
