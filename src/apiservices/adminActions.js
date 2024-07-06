import api from '@/apiservices/api'
import { defineStore } from 'pinia'

const countryList = ref([])
let stateList = []

export const useAllAdminActions = defineStore('AllAdminActions', {
  actions: {

    // 👉  fetch All Countries 
    fetchCountries(params) { return api.get('/GetCountries', { params }) },

    
    //// 👉   fetch All State 
    async fetchStateByCountry(countryId) {
      
      const countryList = await this.fetchCountries()
      const getCountry = countryList.data.countries
      
      if (Array.isArray(getCountry)) {
        // Find the selected country object based on its ID
        for (const country of getCountry) {
          if (country.id === countryId) {
            stateList = country.states
            break
          }
        }
      } else {
        throw new Error('Countries data is not in the expected format')
      }

      return stateList
    
    },

    // 👉 Fetch All ministry  data on table
    fetchMinistryFromApi(params) { return api.get('/AllMinistry', { params }) },

    // 👉 Fetch All parish  data on table
    fetchAllParish(params) { return api.get('/getAllParishes', { params }) },

    // 👉 Fetch All committee
    fetchAllcommittee(params) { return api.get('/getAllCommittee', { params }) },

    // 👉 Fetch All title
    fetchAlltitle(params) { return api.get('/getAlltitle', { params }) },

    async fetchStateParish(statename) {
      try {
        // Fetch parish data based on the provided state name
        return await api.get(`/getParishByState/${statename}`)// Assuming the response contains parish data
      } catch (error) {
        throw new Error('Failed to fetch parish by state')
      }
    },
  
  

    // 👉 Add User
    addParish(parishData) {

      console.log('Post Data from admin action', postData)

      // return new Promise((resolve, reject) => {
      //   api.post('/apps/users/user', {
      //     user: parishData,
      //   }).then(response => resolve(response))
      //     .catch(error => reject(error))
      // })

    },

    
    async addNewCommittee(postData) {
      console.log('Post Data from admin action', postData)

      // try {
      //   return await api.post('/addcommittee', {
      //     postData,
      //   })
      // } catch (error) {
      //   throw new Error('Failed to fetch parish by state')
      // }

    },
  
    

  },
})



// export const avatarText = value => {
//   if (!value)
//     return ''
//   const nameArray = value.split(' ')
  
//   return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
// }

