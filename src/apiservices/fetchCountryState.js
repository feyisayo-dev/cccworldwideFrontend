import api from '@/apiservices/api'
import axios from '@axios'
import { defineStore } from 'pinia'

export const useCountryStateActions = defineStore('AllCountryStatesActions', {
  actions: {
    // 👉 Fetch All parish  data
    fetchCountryWithState(params) { return api.get('/GetCountries', { params }) },

    // // 👉 Add User
    // addUser(userData) {
    //   return new Promise((resolve, reject) => {
    //     axios.post('/apps/users/user', {
    //       user: userData,
    //     }).then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },

    // 👉 fetch single user
    fetchUser(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // 👉 Delete User
    deleteUser(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/apps/users/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})



// export const avatarText = value => {
//   if (!value)
//     return ''
//   const nameArray = value.split(' ')
  
//   return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
// }

