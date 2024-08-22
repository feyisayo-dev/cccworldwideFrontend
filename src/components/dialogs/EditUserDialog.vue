<script setup>
import { useUserListStore } from '@/apiservices/membersList'
import laptopGirl from '@images/illustrations/laptop-girl.png'
import { onMounted, ref } from 'vue'


const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },

  userData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'updatedData',
])

const form = ref({
  countryList: [],
  stateList: [],
  preSelectedCountry: userData.value.Country || '',
  preSelectedState: userData.value.State || '',
  Gender: userData.value.Gender || '',
  MStatus: userData.value.MStatus || '',
  Status: userData.value.Status || '',
  sname: userData.value.sname || '',
  fname: userData.value.fname || '',
  Residence: userData.value.Residence || '',
  Title: userData.value.Title || '',
  dot: userData.value.dot || '',
  ministry: userData.value.ministry || '',
  dob: userData.value.dob || '',
  parishname: userData.value.parishname || '',
  city: userData.value.City || '',
  parishcode: userData.value.parishcode || '',
  avatar: userData.value.avatar || '',
})

const userListStore = useUserListStore()

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

const  getResidentialState = () => {
  // form.value.stateList = []
  // form.value.selectedState = ''
  console.log("<=========This is the country id picked for residential==========>", form.value.selectedCountry)

  if (form.value.selectedCountry) {
    form.value.getCountryById = form.value.countryList.find(country => country.id === form.value.selectedCountry)
    console.log("<=========This is the country picked for residential==========>", form.value.getCountryById)
    form.value.residentialCountry = form.value.getCountryById.name

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

const getChurchState = () => {
  if (form.value.selectedchurchCountry) {
    console.log("<=========This is the country picked for parish==========>", form.value.selectedchurchCountry)

    form.value.churchStateList = []
    form.value.selectedParishState = ''

    try {
      const data = form.value.selectedchurchCountry.states

      if (Array.isArray(data) && data.length > 0) {
        form.value.churchStateList = data.map(churchState => ({
          country_id: churchState.country_id,
          name: churchState.name,
        }))
      }

    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }
}

const  getGenderTitle = () => {
  if (form.value.Gender) {

    const gender = form.value.Gender

    getTitleByGender(gender)

  
  }
}

const fetchParishes = async state => {
  if (state) {
    try {
      form.value.parishList = []
      form.value.selectedParish = ''  // Clear the selected parish
      console.log("<=====This is the state of the church======>", state)

      const response = await allAdminActions.fetchStateParish(state)


      const data = response.data
      if (data.Allparish && data.Allparish.length > 0) {
        form.value.parishList = data.Allparish.map(parish => ({
          parishname: `${parish.parishname} ${parish.address}`,
          country: parish.country,
          states: parish.states,
          city: parish.city,
          parishaddress: parish.address,
          name: parish.parishname,
          parishcode: parish.parishcode,
        }))
      }
      console.log("<=====This is the response======>", form.value.parishList)

    } catch (error) {
      console.log('Error fetching data:', error)
    }
  }
}

const getStateParish = () => {
  if (form.value.selectedParishState) {
    console.log("<=========This is the state picked for parish==========>", form.value.selectedParishState)
    fetchParishes(form.value.selectedParishState)
  } else {
    console.log("No state is selected")
  }
}

watch(() => form.value.selectedParish, newValue => {

  if (newValue) {
  // Find the parish object corresponding to the selected parish code
    const selectedParishObject = form.value.parishList.find(parish => parish.parishcode === newValue)

    if (selectedParishObject) {
      console.log("Selected Parish Name:", selectedParishObject.parishname)
      form.value.userParish = selectedParishObject.parishname
      form.value.userParishCode = newValue


    } else {
      console.log("Parish not found")
    }
  }
})

const onCountryChange = () => {
  form.value.selectedParishState = ''
  form.value.selectedParish = ''
  form.value.churchStateList = []
  form.value.parishList = []

  getChurchState()
}

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


const getTitleByGender = async getByGendervalue => {
  
  try {
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
</script>

<template>
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
            v-model="form.altPhoneno"
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
            label="Country of residence"
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
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VAutocomplete
            v-model="form.selectedState"
            label="State of residence"
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
          <AppCombobox
            v-model="form.selectedchurchCountry"
            label="Country"
            :items="form.countryList"
            item-title="name"
            item-value="id"
            density="compact"
            variant="outlined"
            @change="onCountryChange"
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
          <VAutocomplete
            v-model="form.selectedParishState"
            label="State"
            :items="form.churchStateList"
            item-title="name"
            placeholder="Select state"
            @change="getStateParish"
          />
        </VCol>

        <VCol
          cols="6"
          md="6"
        >
          <VAutocomplete
            v-model="form.selectedParish"
            label="Parish"
            :items="form.parishList"
            item-value="parishcode"
            :item-title="item => item.parishname || 'Select Parish'"
            :hint="`${form.selectedParish}`"
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
            Alternative Phone number {{ form.altPhoneno }}
          </p>
          <p class="mb-1">
            Residential Address {{ form.address }}
          </p>
          <p class="mb-1">
            Country {{ form.residentialCountry }}
          </p>
                  
          <p class="mb-1">
            State {{ form.selectedState }}
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
            Parish: {{ form.userParish }} - {{ form.userParishCode }}
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
</template>

<style lang="scss">
.permission-table {
  td {
    border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    padding-block: 0.5rem;
    padding-inline: 0;
  }
}
</style>
