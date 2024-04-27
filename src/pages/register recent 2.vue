<!-- eslint-disable vue/no-lone-template -->
<script setup>
import api from '@/apiservices/api'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { default as registerMultistepIllustrationDark, default as registerMultistepIllustrationLight } from '@images/illustrations/ccclogo.png'
import registerMultistepBgDark from '@images/pages/register-multistep-bg-dark.png'
import registerMultistepBgLight from '@images/pages/register-multistep-bg-light.png'




const registerMultistepBg = useGenerateImageVariant(registerMultistepBgLight, registerMultistepBgDark)
const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const registerMultistepIllustration = useGenerateImageVariant(registerMultistepIllustrationLight, registerMultistepIllustrationDark)

const radioContent = [
  {
    title: 'Starter',
    desc: 'A simple start for everyone.',
    value: '0',
  },
  {
    title: 'Standard',
    desc: 'For small to medium businesses.',
    value: '99',
  },
  {
    title: 'Enterprise',
    desc: 'Solution for big organizations.',
    value: '499',
  },
]

const items = [{
  title: 'Account',
  subtitle: 'Account Details',
  icon: 'tabler-smart-home',
},
{
  title: 'Personal Details',
  subtitle: 'Personal Information',
  icon: 'tabler-users',
},
{
  title: 'Anoiting Details',
  subtitle: 'Joinning/Anoiting Details',
  icon: 'tabler-file-text',
},
{
  title: 'Contact Details',
  subtitle: 'Contact Details',
  icon: 'tabler-file-text',
},
{
  title: 'Church Details',
  subtitle: 'Church Information',
  icon: 'tabler-file-text',
}]

import { onMounted, ref } from 'vue'

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  sname: '',
  fname: '',
  mname: '',
  Gender: 'Select your gender',
  dob: '',
  MStatus: 'Select status',
  VineyardStatus: 'Select Vineyard status',
  title: 'Select present title',
  dot: '',
  selectedMinistry: 'Select Ministry',
  mobile: '',
  address: '',
  selectedCountry: 'Select Country of residence',
  selectedState: 'Select state of residence',
  selectedchurchCountry: ['Nigeria'],
  selectedChurchState: 'Select state',
  state: '',
  city: '',
  Country: '',
  seletedParish: 'Select parish',
  getTitleByGendervalue: '',
  selectedParishState: 'Select state',
  getParisByState: '',

  // Add other form fields as needed list here
  ministryList: [],
  countryList: [],
  stateList: [],
  churchStateList: [],
  titleList: [],
  parishList: [],
})

async function fetchCountries() {
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const response=await api.get('/GetCountries')
    const data=response.data
    if(data.countries&&data.countries.length>0) {
    

      form.value.countryList = data.countries.map(country => ({
        id: country.id,
        name: country.name,
        flag_img: country.flag_img,
        states: country.states,
      }))
    }


  } catch(error) {
    console.error('Error fetching data:', error)
  }
}


const getFormData = () => {
  // Gather all form data here


  // Display the form data in an alert for debugging
  console.log((form.value.email))
  console.log((form.value.password))
  
  
  // return formData
}



const register =    () => {
  alert('Submitted from registerd..!!')
 
  // try{

  //   alert(email.value);

  //   // const response = api.post('/Addmember', {
  //   //   email: email.value,  // Assuming email and password are reactive variables
  //   //   password: password.value,
  //   //   confirmPassword: confirmPassword.value,
  //   // }).then(response => {

  

  //   //   const { accessToken, userData, userAbilities } = response.data



  //   //   if (userData) {

  //   //     console.log('Got usersData here', userData)

  //   //     localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
  //   //     ability.update(userAbilities)
  //   //     localStorage.setItem('userData', JSON.stringify(userData))
  //   //     localStorage.setItem('accessToken', JSON.stringify(accessToken))

  //   //     // router.push('/')
  //   //     router.replace(route.query.to ? String(route.query.to) : '/')

  //   //   } 
  //   // }).catch(e => {
  //   //   // const { errors: formErrors } = e.response.data

  //   //   // errors.value = formErrors
  //   //   // console.error(e.response.data)
  //   // })

   
  // }  catch (error) {
  //   // console.error('Error:', error)
  // }



}

const fetchMinistryFromApi = async () => {
  
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const response = await api.get('/AllMinistry')
    const data = response.data

    // Set the ministry data to the form
    // form.value.ministry = data.ministry
    
    // Handle the retrieved data as needed
    // Assuming 'ministry' is the key for the array of ministries in the API response

    if (data.ministry && data.ministry.length > 0) {
      form.value.ministryList = data.ministry.map(ministry => ministry.ministry)
    }

  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const fetchParishes = async selectedParishState => {
  
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const response = await api.get(`/getParishByState/${selectedParishState}`)
    const data = response.data

   
    // Set the parishes data to the form
    console.log(JSON.stringify(data))
  
    if(data.Allparish&&data.Allparish.length>0) {

      form.value.parishList = data.Allparish.map(parish => ({
        parishname: parish.parishname,
        country: parish.country,
        states: parish.states,
        city: parish.city,
        parishaddress: parish.address,
        name: parish.parishname,
      }))
    }


   

  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const getTitleByGender = async getByGendervalue => {
  
  try {
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint
    const response = await api.get(`/getTitleByGender/${getByGendervalue}`)
    const data = response.data.titles 

  

    if(data&&data.length>0) {
    

      form.value.titleList = data.map(genderTitles => ({
        level: genderTitles.level,
        title: genderTitles.title,
       
      }))
    }
    
  
  
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}


onMounted(() => {
  fetchMinistryFromApi()
  fetchCountries()
  fetchParishes()
})

const  getResidentialState = () => {
  form.value.stateList = []
  form.value.selectedState = 'Select state of residence'
  if (form.value.selectedCountry) {
    
    try {
      const data=form.value.selectedCountry.states
      
      if(Array.isArray(data) && data.length>0){
        form.value.stateList = data.map(countryState => ({
          country_id: countryState.country_id,
          name: countryState.name,
        }))
      }
    } catch (error) {
      
    }
  }
}

const  getChurchState = () => {
  if (form.value.selectedchurchCountry) {

    form.value.churchStateList = []
    form.value.selectedChurchState = 'Select state'
  
    try {
      const data=form.value.selectedchurchCountry.states
      
      if(Array.isArray(data) && data.length>0){
        form.value.churchStateList = data.map(churchState => ({
          country_id: churchState.country_id,
          name: churchState.name,
        }))
       
      }

    } catch (error) {
      
    }
  }
}

const  getGenderTitle = () => {
  if (form.value.Gender) {

    const gender = form.value.Gender

    getTitleByGender(gender)

  
  }
}

const  getStateParish = () => {
  if (form.value.selectedParishState) {

    const state=form.value.selectedParishState

    fetchParishes(state)
  
  }
}

//submit to call the login function 
const onSubmit = () => {

  getFormData()

  // alert('Am submitting')

}



watchEffect(() => {
  getResidentialState()
  getChurchState()
  getGenderTitle()
  getStateParish()

 
})
</script>



<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="1"
      class="d-none d-md-flex"
    >
      <!-- here your illustration -->
      <div class="d-flex justify-center align-center w-100 position-relative">
        <VImg
          :src="registerMultistepIllustration"
          class="illustration-image"
        />
        <VImg
          :src="registerMultistepBg"
          class="bg-image position-absolute w-100"
        />
      </div>
    </VCol>

    <VCol
      cols="30"
      md="10"
      class="auth-card-v2 d-flex align-center justify-center pa-10"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        class="mt-16 mt-sm-0"
      >
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          icon-size="25"
          class="stepper-icon-step-bg mb-8"
        />

        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
          style="max-width: 800px;"
        >
          <VForm
            form="ref"
            class="justify-center align-center"
          >
            <!-- This is account details step view -->
           
            <VWindowItem>
              <h5 class="text-h4 mb-1">
                Account Information
              </h5>
              <p class="text-sm">
                Enter Your Account Details
              </p>

              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.email"
                    label="Email"
                    placeholder="Enter your Email address"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.password"
                    label="Password"
                    placeholder="Enter your Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your Password"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </VCol>

                <!--
                  <VCol cols="12">
                  <AppTextField
                  v-model="form.link"
                  label="Profile Link"
                  type="url"
                  />
                  </VCol>
                -->
              </VRow>
            </VWindowItem>

            <!-- This is personal details step view -->
            <VWindowItem>
              <h5 class="text-h5 mb-1">
                Personal Information
              </h5>
              <p class="text-sm">
                Enter Your Personal Information
              </p>

              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.sname"
                    label="Surname Name"
                    placeholder="Enter your Surname Name"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.fname"
                    label="First Name"
                    placeholder="Enter your First Name"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.name"
                    label="Middle Name"
                    placeholder="Enter your Middle Name"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="form.Gender"
                    label="Gender"
                    :items="['Male', 'Female']"
                    placeholder=" Select your gender"
                    @change="getGenderTitle"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.dob"
                    type="date"
                    label="DOB (Your year of birth is not show to anyone)"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <!-- This is joinnning/Anoting details step view -->
            <VWindowItem>
              <h5 class="text-h5 mb-1">
                Joinning/Anoiting Information
              </h5>
              <p class="text-sm">
                Enter Your Joinning/Anoiting
              </p>

              <VRow>
                <VCol cols="12">
                  <AppSelect
                    v-model="form.MStatus"
                    label="Member Status"
                    placeholder=" Select status "
                    :items="['Member/Laity', 'Vineyard Worker']"
                  />
                </VCol>

                <VCol
                  v-if="form.MStatus == 'Vineyard Worker'"
                  cols="12"
                >
                  <AppSelect
                    v-model="form.VineyardStatus"
                    label="Vineyard Status"
                    placeholder=" Select Vineyard status "
                    :items="['Shepherd','Asst. Shepherd','Wolider','Wolima','Church Worker','Pastor']"
                  />
                </VCol>

                <VCol
                  cols="6"
                  md="6"
                >
                  <AppSelect
                    v-model="form.title"
                    label="Present Title"
                    :items="form.titleList"
                  />
                </VCol>

                <VCol
                  cols="6"
                  md="6"
                >
                  <AppTextField
                    v-model="form.dot"
                    type="date"
                    label="Date of present Anoitment"
                  />
                </VCol>

                <VCol cols="12">
                  <AppSelect
                    id="ministrySelect"
                    v-model="form.selectedMinistry"
                    label="Ministry"
                    :items="form.ministryList"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <!-- This is contact details step view -->
            <VWindowItem>
              <h5 class="text-h5 mb-1">
                Contact Information
              </h5>
              <p class="text-sm">
                Enter Your contact details
              </p>
              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <VPhoneInput
                    label="WhatsApp Phone number"
                    country-label="Country"
                    country-aria-label="Country for phone number"
                    invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VPhoneInput
                    label="Alternative Phone number"
                    country-label="Country"
                    country-aria-label="Country for phone number"
                    invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextarea
                    v-model="form.address"
                    label="Residential Address"
                    placeholder="Residential Address Street number and name"
                  />
                </VCol>
                <VCol cols="12">
                  <!--
                    <pre>{{ form.countryList }}</pre>
                    <pre>{{ form.selectedCountry }}</pre>
                  -->
                  <AppCombobox
                    v-model="form.selectedCountry"
                    label="Country"
                    :items="form.countryList"
                    item-title="name"
                    item-value="id"
                    @change="getResidentialState"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="form.selectedState"
                    label="State"
                    :items="form.stateList"
                    item-title="name"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.city"
                    label="City"
                    placeholder="Enter your Residenctial City"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <VWindowItem>
              <h5 class="text-h5 mt-10">
                Church Information
              </h5>
              <p class="text-sm">
                Enter your current church information
              </p>
              <VRow>
                <VCol cols="12">
                  <AppCombobox
                    v-model="form.selectedchurchCountry"
                    label="Country"
                    :items="form.countryList"
                    item-title="name"
                    item-value="id"
                    @change="getChurchState"
                  />
                </VCol>

                <VCol
                  cols="6"
                  md="4"
                >
                  <AppSelect
                    v-model="form.selectedParishState"
                    label="State"
                    :items="form.churchStateList"
                    item-title="name"
                    placeholder=" Select state "
                    @change="getStateParish"
                  />
                </VCol>

                <VCol
                  cols="6"
                  md="4"
                >
                  <!-- <span style="color: rgb(26, 196, 26);">Parish Address :{{ form.parish }}</span> -->
                  <AppSelect
                    v-model="form.seletedParish"
                    label="Parish"
                    :items="form.parishList"
                    :item-title="item => `${item.name}-${item.parishaddress}`"
                    :hint="`${form.seletedParish}`"
                    persistent-hint
                    double-line
                  />
                </VCol>
              </VRow>
            </VWindowItem>
          </VForm>
        </VWindow>

        <div class="d-flex justify-space-between mt-8">
          <VBtn
            color="secondary"
            :disabled="currentStep === 0"
            variant="tonal"
            @click="currentStep--"
          >
            <VIcon
              icon="tabler-arrow-left"
              start
              class="flip-in-rtl"
            />
            Previous
          </VBtn>

          <VBtn
            v-if="items.length - 1 === currentStep"
            color="success"
            append-icon="tabler-check"
            @click="onSubmit"
          >
            submit
          </VBtn>

          <VBtn
            v-else
            @click="currentStep++"
          >
            Next

            <VIcon
              icon="tabler-arrow-right"
              end
              class="flip-in-rtl"
            />
          </VBtn>
        </div>
      </VCard>
    </VCol>
    <VCol
      md="1"
      class="d-none d-md-flex"
    >
      <!-- here your illustration -->
      <div class="d-flex justify-center align-center w-100 position-relative">
        <VImg
          :src="registerMultistepIllustration"
          class="illustration-image"
        />
        <VImg
          :src="registerMultistepBg"
          class="bg-image position-absolute w-100"
        />
      </div>
    </VCol>
  </VRow>
</template>



<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>


