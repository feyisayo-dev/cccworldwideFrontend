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

    FetchAllMembers(params) { return api.get('/Allmember', { params }) },


    // 👉 Fetch All committee
    fetchAllcommittee(params) { return api.get('/getAllCommittee', { params }) },

    // 👉 Fetch All title
    fetchAlltitle(params) { return api.get('/getAlltitle', { params }) },

    async fetchStateParish(statename) {
      try {
        console.log('This is the state name', statename)
        
        return await api.get(`/getParishByState/${statename}`)// Assuming the response contains parish data
      } catch (error) {
        throw new Error('Failed to fetch parish by state')
      }
    },
  
    updateAparish(UpdateParishData) {
      return new Promise((resolve, reject) => {
        console.log("This is the data gotten to the all Admin Actions", UpdateParishData)
        api.post('/updateAparish', {
          postData: UpdateParishData,  // Wrap parishData inside postData key
        })
          .then(response => {
            resolve(response)  // Resolve the promise with the API response
          })
          .catch(error => {
            reject(error)  // Reject the promise with the error
          })
      })
    },

    updateMinistry(ministryData) {
      return new Promise((resolve, reject) => {
        console.log("This is the data gotten to the all Admin Actions", ministryData)
        api.post('/updateMinistry', {
          postData: ministryData,  // Wrap parishData inside postData key
        })
          .then(response => {
            resolve(response)  // Resolve the promise with the API response
          })
          .catch(error => {
            reject(error)  // Reject the promise with the error
          })
      })
    },

    // 👉 Add Parish
    addNewParish(parishData) {
      return new Promise((resolve, reject) => {
        api.post('/AddParish', {
          postData: parishData,  // Wrap parishData inside postData key
        })
          .then(response => {
            resolve(response)  // Resolve the promise with the API response
          })
          .catch(error => {
            reject(error)  // Reject the promise with the error
          })
      })
    },

    // 👉 Delete Parish
    deleteParish(deleteParishData) {
      return new Promise((resolve, reject) => {
        api.post('/deleteAParish', {
          postData: deleteParishData,  // Wrap parishData inside postData key
        })
          .then(response => {
            resolve(response)  // Resolve the promise with the API response
          })
          .catch(error => {
            reject(error)  // Reject the promise with the error
          })
      })
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

