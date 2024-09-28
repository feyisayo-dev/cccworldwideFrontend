import axios from '@axios'

const api = axios.create({
  baseURL: 'https://backendapiendpoint.cccagiliti1.org/api',
})
  
export default api
