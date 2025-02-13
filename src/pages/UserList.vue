<template>
  <div>
    <div class="flex justify-between items-center q-mb-md q-mt-md">
      <div class="text-h4 q-ml-md">會員列表</div>

      <!-- 切換進階搜尋按鈕 -->
      <q-btn :label="isAdvancedSearch ? '基本搜尋' : '進階搜尋'" :icon="isAdvancedSearch ? 'unfold_less' : 'unfold_more'" flat
        @click="isAdvancedSearch = !isAdvancedSearch" class="q-mr-md" />
    </div>

    <!-- 搜尋區域 -->
    <q-card class="q-mb-md q-mx-md">
      <q-card-section>
        <!-- 基本搜尋 -->
        <template v-if="!isAdvancedSearch">
          <div class="row items-center justify-end q-gutter-md">
            <!-- 搜尋類型選擇 -->
            <q-select v-model="searchType" :options="searchOptions" label="搜尋類型" dense outlined style="width: 150px"
              emit-value map-options />

            <!-- 一般搜尋輸入框 -->
            <template v-if="searchType !== 'userBirthDate'">
              <q-input v-model="searchKeyword" :label="getSearchPlaceholder" dense outlined style="width: 200px"
                @keyup.enter="handleSearch">
                <template v-slot:append>
                  <q-icon name="search" class="cursor-pointer" @click="handleSearch" />
                </template>
              </q-input>
            </template>

            <!-- 生日日期範圍選擇器 -->
            <template v-else>
              <div class="row items-center q-gutter-sm">
                <q-input v-model="dateRange.from" dense outlined style="width: 150px" label="起始日期">

                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <!-- 選日期的彈出視窗 -->
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dateRange.from">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="確定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <div class="text-grey">至</div>

                <q-input v-model="dateRange.to" dense outlined style="width: 150px" label="結束日期">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">

                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dateRange.to">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="確定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>

                <q-btn icon="search" color="primary" dense @click="handleDateSearch">
                  <q-tooltip>搜尋</q-tooltip>
                </q-btn>
              </div>
            </template>
          </div>
        </template>

        <!-- 進階搜尋 -->
        <template v-else>
          <div class="row q-col-gutter-md">
            <!-- 姓名 -->
            <div class="col-3">
              <q-input v-model="advancedSearchForm.userName" label="會員姓名" dense outlined />
            </div>

            <!-- 身分證字號 -->
            <div class="col-3">
              <q-input v-model="advancedSearchForm.userIdCard" label="身分證字號" dense outlined />
            </div>

            <!-- 電話 -->
            <div class="col-3">
              <q-input v-model="advancedSearchForm.userPhone" label="電話" dense outlined />
            </div>

            <!-- 信箱 -->
            <div class="col-3">
              <q-input v-model="advancedSearchForm.userEmail" label="信箱" dense outlined />
            </div>

            <!-- 生日範圍 -->
            <div class="col-3">
              <q-input v-model="advancedSearchForm.userBirthDateStart" dense outlined label="生日起始日期">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="advancedSearchForm.userBirthDateStart">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="確定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-3">
              <q-input v-model="advancedSearchForm.userBirthDateEnd" dense outlined label="生日結束日期">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="advancedSearchForm.userBirthDateEnd">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="確定" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <!-- 驗證狀態 -->
            <div class="col-3">
              <q-select v-model="advancedSearchForm.userIsVerified" :options="verifiedOptions" label="驗證狀態" dense
                outlined emit-value map-options />
            </div>
          </div>

          <!-- 進階搜尋按鈕組 -->
          <div class="row justify-end q-gutter-sm q-mt-md">
            <q-btn label="重置" color="grey" @click="resetAdvancedSearch" />
            <q-btn label="搜尋" color="primary" @click="handleAdvancedSearch" />
          </div>
        </template>
      </q-card-section>
    </q-card>

    <!-- 使用者列表表格 -->
    <q-table :rows="users" :columns="columns" row-key="userId" :loading="loading">
      <!-- 驗證狀態列 -->
      <template v-slot:body-cell-userIsVerified="props">
        <q-td :props="props">
          <q-chip :color="props.row.userIsVerified ? 'positive' : 'negative'" text-color="white"
            :label="props.row.userIsVerified ? '已認證' : '未認證'" />
        </q-td>
      </template>

      <!-- 操作列 -->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn flat round color="primary" icon="edit" @click="openEdit(props.row)">
            <q-tooltip>編輯使用者</q-tooltip>
          </q-btn>
        </q-td>
      </template>


    </q-table>

    <!-- 編輯會員資料的對話框 -->
    <EditUserDialog v-model="isEditDialogOpen" :userData="editUserData" @save="saveEditUser" @delete="deleteUser" />
  </div>
</template>




<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../boot/axios';
import EditUserDialog from '../components/EditUserDialog.vue'
import { useUserEdit } from '../hooks/useUserEdit'
import { useUserSearch } from '../hooks/useUserSearch'


const columns = [
  { name: 'userId', label: "使用者ID", field: 'userId', sortable: true },
  { name: 'userName', label: "使用者名字", field: 'userName', sortable: true },
  { name: 'userBirthDate', label: "生日", field: 'userBirthDate', sortable: true },
  { name: 'userIdCard', label: "身分證字號", field: 'userIdCard' },
  { name: 'userPhone', label: "電話", field: 'userPhone' },
  { name: 'userEmail', label: "信箱", field: 'userEmail' },
  { name: "userIsVerified", label: "驗證", field: "userIsVerified" },
  { name: "action", label: "操作", field: "action" }
]

const users = ref([])
const loading = ref(false)


// 獲取使用者列表
const fetchUsers = async () => {
  console.log('fetchUsers triggered', new Error().stack)
  loading.value = true
  try {
    const { data } = await api.get('/users/all')
    users.value = [...data.data]
  } catch (error) {
    console.error('獲取使用者列表失敗:', error)
  } finally {
    loading.value = false
  }
}



// 編輯
const {
  searchType,
  searchKeyword,
  dateRange,
  searchOptions,
  getSearchPlaceholder,
  handleSearch,
  handleDateSearch,
  isAdvancedSearch,
  advancedSearchForm,
  verifiedOptions,
  resetAdvancedSearch,
  handleAdvancedSearch
} = useUserSearch(users, loading, fetchUsers)

// 編輯相關
const {
  editUserData,
  isEditDialogOpen,
  openEdit,
  saveEditUser,
  deleteUser
} = useUserEdit(() => {
  return fetchUsers()
})
onMounted(fetchUsers)
</script>

<style scoped>
.q-table__container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
