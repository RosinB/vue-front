import { ref, computed } from 'vue'
import { api } from '../boot/axios'

export function useUserSearch(users, loading, fetchUsers) {
  const searchType = ref('all')
  const searchKeyword = ref('')
  const dateRange = ref({
    from: '',
    to: '',
  })

  const searchOptions = [
    { label: '全部', value: 'all' },
    { label: '使用者名字', value: 'userName' },
    { label: '身分證字號', value: 'userIdCard' },
    { label: '電話', value: 'userPhone' },
    { label: '信箱', value: 'userEmail' },
    { label: '生日', value: 'userBirthDate' },
  ]

  const getSearchPlaceholder = computed(() => {
    const option = searchOptions.find((opt) => opt.value === searchType.value)
    return `搜尋${option.label}`
  })

  const handleSearch = async () => {
    if (!searchKeyword.value.trim()) {
      await fetchUsers()

      return
    }

    loading.value = true
    try {
      const { data } = await api.get(`/users/search/`, {
        params: {
          type: searchType.value,
          keyword: searchKeyword.value.trim(),
        },
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
          to: dateRange.value.to,
        },
      })
      users.value = data.data
    } catch (error) {
      console.error('搜尋失敗:', error)
      alert('搜尋失敗')
    } finally {
      loading.value = false
    }
  }

  const isAdvancedSearch = ref(false)
  const advancedSearchForm = ref({
    userName: '',
    userIdCard: '',
    userPhone: '',
    userEmail: '',
    userBirthDateStart: '',
    userBirthDateEnd: '',
    userIsVerified: null,
  })

  const verifiedOptions = [
    { label: '全部', value: null },
    { label: '已驗證', value: true },
    { label: '未驗證', value: false },
  ]

  const resetAdvancedSearch = () => {
    advancedSearchForm.value = {
      userName: '',
      userIdCard: '',
      userPhone: '',
      userEmail: '',
      userBirthDateStart: '',
      userBirthDateEnd: '',
      userIsVerified: null,
    }
  }

  const handleAdvancedSearch = async () => {
    loading.value = true
    try {
      const cleanData = Object.fromEntries(
        Object.entries(advancedSearchForm.value).filter(
          ([, value]) => value !== null && value !== '',
        ),
      )
      const { data } = await api.post('/users/search/advanced', cleanData)
      users.value = data.data
    } catch (error) {
      console.error('進階搜尋失敗:', error)
      alert('進階搜尋失敗')
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
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
    handleAdvancedSearch,
  }
}
