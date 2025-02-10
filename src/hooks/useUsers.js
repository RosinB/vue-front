import { ref } from 'vue'
import { api } from '../boot/axios'

export function useUsers() {
  // 狀態管理
  const users = ref([])
  const loading = ref(false)
  const userId = ref('')
  const isEditDialogOpen = ref(false)
  const editUserData = ref({})

  // 驗證使用者ID是否存在
  const validateUserId = (id) => {
    return users.value.some(user => user.userId === parseInt(id))
  }

  // 獲取使用者列表
  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/users/all')
      users.value = data.data
    } catch (error) {
      console.error('獲取使用者列表失敗:', error)
    } finally {
      loading.value = false
    }
  }

  // 刪除使用者
  const deleteUser = async () => {
    if (!validateUserId(userId.value)) {
      alert('此使用者ID不存在！')
      return
    }

    if (confirm('確定要刪除嗎?')) {
      try {
        await api.post(`/users/delete/${userId.value}`)
        alert('已刪除')
        await fetchUsers()
        userId.value = ''
      } catch (error) {
        console.error('刪除失敗:', error)
        alert('刪除失敗')
      }
    }
  }

  // 開啟編輯對話框
  const openEdit = (userData) => {
    editUserData.value = { ...userData }
    isEditDialogOpen.value = true
  }

  // 儲存編輯
  const saveEditUser = async () => {
    try {
      await api.post('users/update', editUserData.value)
      alert('更新成功')
      await fetchUsers()
      isEditDialogOpen.value = false
    } catch (error) {
      console.error('更新失敗:', error)
      alert('更新失敗')
    }
  }

  return {
    // 狀態
    users,
    loading,
    userId,
    isEditDialogOpen,
    editUserData,
    // 方法
    validateUserId,
    fetchUsers,
    deleteUser,
    openEdit,
    saveEditUser
  }
}
