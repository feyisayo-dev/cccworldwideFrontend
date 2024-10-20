import axios from '@axios'

const api = axios.create({
  baseURL: 'https://backendapiendpoint.fsdgroup.com.ng/api',
})

export default api
