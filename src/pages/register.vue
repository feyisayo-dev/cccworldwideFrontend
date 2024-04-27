<!-- eslint-disable vue/no-lone-template -->
<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { default as registerMultistepIllustrationDark, default as registerMultistepIllustrationLight } from '@images/illustrations/ccclogo.png'
import registerMultistepBgDark from '@images/pages/register-multistep-bg-dark.png'
import registerMultistepBgLight from '@images/pages/register-multistep-bg-light.png'
import { onMounted, ref } from 'vue'

const registerMultistepBg = useGenerateImageVariant(registerMultistepBgLight, registerMultistepBgDark)
const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const registerMultistepIllustration = useGenerateImageVariant(registerMultistepIllustrationLight, registerMultistepIllustrationDark)
const allAdminActions = useAllAdminActions()

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
  icon: 'tabler-credit-card',
},
{
  title: 'Contact Details',
  subtitle: 'Contact Details',
  icon: 'tabler-map-pin',
},
{
  title: 'Church Details',
  subtitle: 'Church Information',
  icon: 'custom-home',

},
{
  title: 'Review and Summary',
  subtitle: 'Review & Summary',
  icon: 'tabler-file-text',
}]

const form = ref({
  email: '',
  password: '',
  confirmPassword: '',
  sname: ' ',
  fname: '',
  mname: '',
  Gender: 'Select you gender',
  dob: '',
  MStatus: 'Select status',
  VineyardStatus: 'Select Vineyard status',
  title: 'Select present title',
  dot: '',
  selectedMinistry: 'Select Ministry',
  phoneNo: '',
  altPhoneno: '',
  address: '',
  selectedCountry: 'Select Country of residence',
  selectedState: 'Select state of residence',
  selectedchurchCountry: ' ',
  selectedChurchState: 'Select state',
  state: '',
  city: '',
  Country: '',
  seletedParish: 'Select parish',
  getTitleByGendervalue: '',
  selectedParishState: 'Select state',
  getParisByState: '',
  confirm_title: 'Registered!',
  getCountryById: '',

  // Add other form fields as needed list here confirm-title
  ministryList: [],
  countryList: [],
  stateList: [],
  churchStateList: [],
  titleList: [],
  parishList: [],
  genderList: Object.freeze(['Male', 'Female']),
})



//Fetch all country 
const fetchCountries = async () => {
  allAdminActions.fetchCountries({
  }).then(response => {
    const data=response.data
    if(data.countries&&data.countries.length>0) {  
      form.value.countryList = data.countries.map(country => ({
        id: country.id,
        name: country.name,
        flag_img: country.flag_img,
        states: country.states,
      }))
    }
  }).catch(error => {
    console.error(error)
  })
}

//Fetch Ministry
const fetchMinistryFromApi = async () => {
  allAdminActions.fetchMinistryFromApi({
  }).then(response => {
    const data=response.data
    
    form.value.ministry = data.ministry

    if (data.ministry && data.ministry.length > 0) {
      form.value.ministryList = data.ministry.map(ministry => ministry.ministry)
    }

  }).catch(error => {
    console.error(error)
  })
}


const register =    () => {
  
  try{
    const response = api.post('/Addmember', {
      // email: form.value.email,  // Assuming email and password are reactive variables
      // password: form.value.password,
      // sname: form.value.sname,  // Assuming email and password are reactive variables
      // fname: form.value.fname,
      // mname: form.value.mname,  // Assuming email and password are reactive variables
      // Gender: form.value.Gender,
      // dob: form.value.dob,
      // MStatus: form.value.MStatus,
      // Status: form.value.VineyardStatus,
      // Title: form.value.title,
      // dot: form.value.dot,
      // ministry: form.value.selectedMinistry,
      // mobile: form.value.phoneNo,
      // Altmobile: form.value.altphoneNo,
      // address: form.value.address,
      // Country: form.value.selectedCountry.name,
      // State: form.value.selectedState,
      // City: form.value.city,
      // parishcode: form.value.seletedParish,
      email: ',ka@gmail.com',  // Assuming email and password are reactive variables
      password: '123456',
      sname: '123456', // Assuming email and password are reactive variables
      fname: 'Kudi',
      mname: 'Ola',  // Assuming email and password are reactive variables
      Gender: 'female',
      dob: 'qwewe',
      MStatus: 'nsshs',
      Status: 'nsshs',
      Title: 'nsshs',
      dot: 'nsshs',
      ministry: 'nsshs',
      mobile: 'nsshs',
      Altmobile: 'nsshs',
      address: 'nsshs',
      Country: 'nsshs',
      State: 'nsshs',
      City: form.value.city,
      parishcode: form.value.seletedParish,
    }).then(response => {

  


      console.log('Got usersData here register ', JSON.stringify(response.data))

    }).catch(e => {
      // const { errors: formErrors } = e.response.data

      // errors.value = formErrors
      console.error(e.response.data)
    })

   
  }  catch (error) {
    // console.error('Error:', error)
  }



}

// 👉 FetchAll parish from state
const fetchParishes = async () => {
  if ((form.value.selectedState)) {
    try{
      form.value.parishList=[]
      form.value.seletedParish='Select your parish'

      const response = await allAdminActions.fetchStateParish(form.value.selectedParishState)
      const data = response.data
      if(data.Allparish&&data.Allparish.length>0) {

        form.value.parishList = data.Allparish.map(parish => ({
        // parishcode: parish.parishcode,
          parishname: parish.parishname,
          country: parish.country,
          states: parish.states,
          city: parish.city,
          parishaddress: parish.address,
          name: parish.parishname,
          parishcode: parish.parishcode,
        }))
      }
    

    }catch (error) {
      console('Error fetching data:')
    }

 



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
})

const  getResidentialState = () => {
  form.value.stateList = []
  form.value.selectedState = 'Select state of residence'

  if (form.value.selectedCountry) {
    form.value.getCountryById = form.value.countryList.find(country => country.id === form.value.selectedCountry)
  }
 
  if (form.value.getCountryById && Array.isArray( form.value.getCountryById.states) &&  form.value.getCountryById.states.length > 0) {
    
    try {
      const data= form.value.getCountryById.states
      
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

    fetchParishes()
  
  }
}

//submit to call the register function 
const onSubmit = message => {

  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  if (message) {

     
    //   // eslint-disable-next-line sonarjs/no-use-of-empty-return-value
    //   register()

    //     .then(response => {
    //       // Registration successful
    //       alert(response)

    //       // Additional logic if needed
    //     })
    //     .catch(error => {
    //       // Registration failed
    //       alert('Registration failed: ' + error)

    //       // Additional error handling logic if needed
    //     })
   
    // } else {
    //   alert(message)
    // }

    register()
  }
}


// const closeDialog= () => {
//   this.isConfirmDialogVisible = false
//   alert('Cancelled')
// }



watchEffect(() => {
  getResidentialState()
  getChurchState()
  getGenderTitle()
  getStateParish()
})

const isConfirmDialogVisible = ref(false)

const refetchData = hideOverlay => {
  setTimeout(hideOverlay, 3000)
}
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
      md="12"
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
          icon-size="45"
          class="stepper-icon-step-bg mb-10"
        />
        <VDivider />
        <VCardText>
          <!-- 👉 stepper content -->
          <AppCardActions
            action-refresh
            @refresh="refetchData"
          />
          <VForm>
            <VWindow
              v-model="currentStep"
              class="disable-tab-transition"
            >
              <!-- This is account details step view -->
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h4 mb-1">
                      Account Information
                    </h5>
                    <p class="text-sm">
                      Enter Your Account Details
                    </p>
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="form.email"
                      label="Enter Email Address"
                      variant="outlined"
                    />
                  </VCol> 
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.password"
                      label="Enter Password"
                      variant="outlined"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.confirmPassword"
                      label="Confirm Password"
                      variant="outlined"
                      :type="isCPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isCPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                      @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
              <!-- This is personal details step view -->
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h5 mb-1">
                      Personal Information
                    </h5>
                    <p class="text-sm">
                      Enter Your Personal Information
                    </p>
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="form.sname"
                      label="Enter Surname Name"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.fname"
                      label="Enter First Name"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.mname"
                      label="Enter Middle Name"
                      variant="outlined"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="form.Gender"
                      :items="form.genderList"
                      label=" Select you gender"
                      outlined
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
                      label="DOB Your year of birth is not show to anyone"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
              <!-- This is Anoiting details step view -->
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h5 mb-1">
                      Joinning/Anoiting Information
                    </h5>
                    <p class="text-sm">
                      Enter Your Joinning/Anoiting
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
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
                    md="6"
                  >
                    <AppSelect
                      v-model="form.VineyardStatus"
                      label="Vineyard Status"
                      placeholder=" Select Vineyard status "
                      :items="['Shepherd','Asst. Shepherd','Wolider','Wolima','Church Worker','Pastor']"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <AppSelect
                      v-model="form.title"
                      label="Present Title"
                      :items="form.titleList"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <AppTextField
                      v-model="form.dot"
                      type="date"
                      label="Date of present Anoitment"
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <AppSelect
                      id="ministrySelect"
                      v-model="form.selectedMinistry"
                      label="Ministry"
                      :items="form.ministryList"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
              <!-- This is Contact details step view -->
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h5 mb-1">
                      Contact Information
                    </h5>
                    <p class="text-sm">
                      Enter Your contact details
                    </p>
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VPhoneInput
                      v-model="form.phoneNo"
                      label="WhatsApp Phone number"
                      country-label="Country"
                      country-aria-label="Country for phone number"
                      default-country="NG"
                      invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VPhoneInput
                      v-model="form.altphoneNo"
                      label="Alternative Phone number"
                      country-label="Country"
                      country-aria-label="Country for phone number"
                      default-country="NG"
                      invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                    />
                  </VCol>

                  <VCol cols="12">
                    <AppTextField
                      v-model="form.address"
                      label="Residential Address"
                      placeholder="Residential Address Street number and name"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VAutocomplete
                      v-model="form.selectedCountry"
                      label="Country"
                      :items="form.countryList"
                      item-title="name"
                      item-value="id"
                      density="compact"
                      variant="outlined"
                      @change="getResidentialState"
                    >
                      <template #item="{ props: listItemProp, item }">
                        <VListItem v-bind="listItemProp">
                          <template #prepend>
                            <VAvatar
                              :image="item.raw.flag_img"
                              size="30"
                            />
                          </template>
                        </VListItem>
                      </template>
                    </VAutocomplete>
                  
                    <!--
                      <pre>{{ form.countryList }}</pre>
                      <pre>{{ form.selectedCountry }}</pre>
                      
                   

                      <AppAutocomplete
                      v-model="form.selectedCountry"
                      label="Country"
                      :items="form.countryList"
                      item-title="name"
                      item-value="id"
                      density="compact"
                      @change="getChurchState"
                      >
                      <template #item="{ props: listItemProp, item }">
                      <VListItem v-bind="listItemProp">
                      <template #prepend>
                      <VAvatar
                      :image="item.raw.flag_img"
                      size="30"
                      />
                      </template>
                      </VListItem>
                      </template>
                      </AppAutocomplete>  
                    -->
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VAutocomplete
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
              <!-- This is church details step view -->
              <VWindowItem>
                <h5 class="text-h5 mt-10">
                  Church Information
                </h5>
                <p class="text-sm">
                  Enter your current church information
                </p>
                <VRow>
                  <VCol cols="12">
                    <!--
                      <AppCombobox
                      v-model="form.selectedchurchCountry"
                      label="Country"
                      :items="form.countryList"
                      item-title="name"
                      item-value="id"
                      @change="getChurchState"
                      />
                    -->

                    <AppCombobox
                      v-model="form.selectedchurchCountry"
                      label="Country"
                      :items="form.countryList"
                      item-title="name"
                      item-value="id"
                      density="compact"
                      variant="outlined"
                      @change="getChurchState"
                    >
                      <template #item="{ props: listItemProp, item }">
                        <VListItem v-bind="listItemProp">
                          <template #prepend>
                            <VAvatar
                              :image="item.raw.flag_img"
                              size="30"
                            />
                          </template>
                        </VListItem>
                      </template>
                    </AppCombobox>
                  </VCol>

                  <VCol
                    cols="6"
                    md="6"
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
                    md="6"
                  >
                    <!-- <span style="color: rgb(26, 196, 26);">Parish Address :{{ form.parish }}</span> -->
                    <AppSelect
                      v-model="form.seletedParish"
                      label="Parish"
                      :items="form.parishList"
                      item-value="parishcode"
                      :item-title="item => `${item.name}-${item.parishaddress}`"
                      :hint="`${form.seletedParish}`"
                      persistent-hint
                      double-line
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
              <!-- This is review & summary step view -->
              <VWindowItem>
                <div class="text-base">
                  <Vdivider>
                    <h6 class="text-base font-weight-medium mb-2">
                      Account Details
                    </h6>

                    <p class="mb-1">
                      Email address {{ form.email }}
                    </p>

                    <VDivider class="my-4" />

                    <h6 class="text-base font-weight-medium mb-2">
                      Personal Details
                    </h6>

                    <p class="mb-1  text-base">
                      Surname Name <span>{{ form.sname }}</span>
                    </p>
                    <p class="mb-1  text-base">
                      First Name {{ form.fname }}
                    </p>
                    <p class="mb-1  text-base">
                      Middle Name {{ form.mname }}
                    </p>
                    <p class="mb-1">
                      Gender {{ form.Gender }}
                    </p>
                    <p class="mb-1">
                      DOB {{ form.dob }}
                    </p>

                    <VDivider class="my-4" />

                    <h6 class="text-base font-weight-medium mb-2">
                      Joinning/Anoiting Details
                    </h6>

                    <p class="mb-1">
                      Member Status {{ form.MStatus }}
                    </p>
                    <p 
                      v-if="form.MStatus == 'Vineyard Worker'"
                      class="mb-1"
                    >
                      Vineyard Status   {{ form.VineyardStatus }}
                    </p>
                    <p class="mb-1">
                      Present Title  {{ form.title }}
                    </p>
                    <p class="mb-1">
                      Date of present Anoitment {{ form.dot }}
                    </p>
                    <p class="mb-1">
                      Ministry {{ form.selectedMinistry }}
                    </p>

                    <VDivider class="my-4" />

                    <h6 class="text-base font-weight-medium mb-2">
                      Contact Details
                    </h6>

                    <p class="mb-1">
                      WhatsApp Phone number  {{ form.phoneNo }}
                    </p>
                    <p class="mb-1">
                      Alternative Phone number {{ form.altphoneNo }}
                    </p>
                    <p class="mb-1">
                      Residential Address {{ form.address }}
                    </p>
                    <p class="mb-1">
                      Country {{ form.selectedCountry.name }}
                    </p>
                  
                    <p class="mb-1">
                      State {{ form.city }}
                    </p>
                    <VDivider class="my-4" />
                    <h6 class="text-base font-weight-medium mb-2">
                      Church Details
                    </h6>

                    <p class="mb-1">
                      Country {{ form.selectedchurchCountry.name }}
                    </p>
                    <p class="mb-1">
                      State {{ form.selectedParishState }}
                    </p>
                    <p class="mb-1">
                      Parish {{ form.seletedParish.name }}
                    </p>
                  </vdivider>
                </div>
              </VWindowItem>
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
                @click="isConfirmDialogVisible = true"
              >
                Submit
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
            <!-- 👉 Confirm Dialog -->
            <ConfirmDialog
              v-model:isDialogVisible="isConfirmDialogVisible"
              confirmation-question="You are about to confirm this registration Did you want to continue ?"
              cancel-msg="Registration Cancelled!!"
              cancel-title="Cancelled"
              confirm-msg="Your registration is successfully."
              confirm-title="Registered!"
              @confirm="onSubmit"
              @cancel="onCancel"
            />
          </vform>
        </vcardtext>
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
      <div id="confirm" />
    </VCol>
  </VRow>
</template>



<style lang="scss">
#loading-bg {
  position: absolute;
  display: block;
  background: var(--initial-loader-bg  #fff);
  block-size: 100%;
  inline-size: 100%;
}

.loading-logo {
  position: absolute;
  inset-block-start: 40%;
  inset-inline-start: calc(50% - 45px);
}

.loading {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 50%;
  block-size: 55px;
  inline-size: 55px;
  inset-block-start: 50%;
  inset-inline-start: calc(50% - 35px);
}

.loading .effect-1,
.loading .effect-2,
.loading .effect-3 {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 50%;
  block-size: 100%;
  border-inline-start: 3px solid var(--initial-loader-color, #eee);
  inline-size: 100%;
}

.loading .effect-1 {
  animation: rotate 1s ease infinite;
}

.loading .effect-2 {
  animation: rotate-opacity 1s ease infinite 0.1s;
}

.loading .effect-3 {
  animation: rotate-opacity 1s ease infinite 0.2s;
}

.loading .effects {
  transition: all 0.3s ease;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(1turn);
  }
}

@keyframes rotate-opacity {
  0% {
    opacity: 0.1;
    transform: rotate(0deg);
  }

  100% {
    opacity: 1;
    transform: rotate(1turn);
  }
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>


