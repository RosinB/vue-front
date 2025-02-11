import { ref } from 'vue'
import { api } from '../boot/axios'


export const useUserEdit = (fetchUsers) => {
const editUserData = ref({})
const isEditDialogOpen = ref(false)





// 開啟編輯對話框
const openEdit = (userData) => {
  editUserData.value = { ...userData }
  isEditDialogOpen.value = true
}

// 儲存編輯
const saveEditUser = async (userData) => {
  try {
    await api.post('users/update', userData)
    alert('更新成功')
    await fetchUsers()
    isEditDialogOpen.value = false
  } catch (error) {
    console.error('更新失敗:', error)
    alert('更新失敗')
  }
}

// 刪除使用者
const deleteUser = async (userData) => {
  try {
    await api.post(`users/delete/${userData.userId}`)
    alert('刪除成功')
    await fetchUsers()
  } catch (error) {
    console.error('刪除失敗:', error)
    alert('刪除失敗')
  }
}


return {
  editUserData,
  isEditDialogOpen,
  openEdit,
  saveEditUser,
  deleteUser
}
}
