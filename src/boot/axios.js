import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { LocalStorage } from 'quasar'
const api = axios.create({ baseURL: 'http://localhost:8082' })

api.interceptors.request.use((config) => {
  const token = LocalStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } return config}
  , error => {
    return Promise.reject(error)

})

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
