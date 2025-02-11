import { ref, computed } from 'vue'
import {api} from '../boot/axios'

export  function useUserSearch(fetchUsers, users, loading) {
const searchType = ref('all')
const searchKeyword = ref('')
const dateRange = ref({
  from: '',
  to: ''
})
const searchOptions = [
  { label: '全部', value: 'all' },
  { label: '使用者名字', value: 'userName' },
  { label: '身分證字號', value: 'userIdCard' },
  { label: '電話', value: 'userPhone' },
  { label: '信箱', value: 'userEmail' },
  { label: '生日', value: 'userBirthDate' }  // 添加生日選項
]

const getSearchPlaceholder = computed(() => {
  const option = searchOptions.find(opt => opt.value === searchType.value)
  return `搜尋${option.label}`
})

// 處理搜尋
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    await fetchUsers()
    return
  }

  loading.value = true
  console.log(searchType.value, searchKeyword.value.trim())
  try {
    const { data } = await api.get(`/users/search/`, {
      params: {
        type: searchType.value,
        keyword: searchKeyword.value.trim()
      }
    })
    users.value = data.data
  } catch (error) {
    console.error('搜尋失敗:', error)
    alert('搜尋失敗')
  } finally {
    loading.value = false
  }
}




const handleDateSearch = async () => {
  if (!dateRange.value.from || !dateRange.value.to) {
    alert('請選擇完整的日期範圍')
    return
  }

  loading.value = true
  try {
    const { data } = await api.get('/users/search/birthdate', {
      params: {
        from: dateRange.value.from,
        to: dateRange.value.to
      }
    })
    users.value = data.data
  } catch (error) {
    console.error('搜尋失敗:', error)
    alert('搜尋失敗')
  } finally {
    loading.value = false
  }
}


// 下面是進階搜尋




const isAdvancedSearch = ref(false)

const advancedSearchForm = ref({
  userName: '',
  userIdCard: '',
  userPhone: '',
  userEmail: '',
  userBirthDateStart: '',
  userBirthDateEnd: '',
  userIsVerified: null
})


// 驗證狀態選項
const verifiedOptions = [
  { label: '全部', value: null },
  { label: '已驗證', value: true },
  { label: '未驗證', value: false }
]




// 重置進階搜尋表單
const resetAdvancedSearch = () => {
  advancedSearchForm.value = {
    userName: '',
    userIdCard: '',
    userPhone: '',
    userEmail: '',
    userBirthDateStart: '',
    userBirthDateEnd: '',
    userIsVerified: ''
  }
}

const advancedSearchData = (data) => {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== null && value !== ''))
}

// 處理進階搜尋
const handleAdvancedSearch = async () => {
  loading.value = true
  try {

    const cleanData = advancedSearchData(advancedSearchForm.value)
    console.log(cleanData)
    const { data } = await api.post("/users/search/advanced", cleanData)
    users.value = data.data
  } catch (error) {
    console.error('進階搜尋失敗:', error)
    alert('進階搜尋失敗')
  } finally {
    loading.value = false
  }
}








return {
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
}
}
