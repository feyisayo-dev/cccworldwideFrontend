<script setup>
import { useUserListStore } from '@/apiservices/membersList'
import laptopGirl from '@images/illustrations/laptop-girl.png'
import { onMounted, ref } from 'vue'
import { useAllAdminActions } from '@/apiservices/adminActions'


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

import api from '@/apiservices/api'

const allAdminActions = useAllAdminActions()

const userData = JSON.parse(localStorage.getItem('userData') || 'null')

console.log("<===This is the userData>", userData)

const isConfirmDialogVisible = ref(false)

const apiResponseStatus = ref('')
const apiResponseMessage = ref('')

const form = ref({
  countryList: [],
  stateList: [],
  ministryList: [],
  titleList: [],
  preSelectedCountry: userData.Country || '',
  preSelectedState: userData.State || '',
  Gender: userData.Gender || '',
  MStatus: userData.MStatus || '',
  Status: userData.Status || '',
  sname: userData.sname || '',
  mname: userData.mname || '',
  fname: userData.fname || '',
  getCountryById: '',
  State: userData.State || '',
  Country: userData.Country || '',
  email: userData.email || '',
  mobile: userData.mobile || '',
  Altmobile: userData.Altmobile || '',
  Residence: userData.Residence || '',
  Title: userData.Title || '',
  dot: userData.dot || '',
  ministry: userData.ministry || '',
  dob: userData.dob || '',
  parishname: userData.parishname || '',
  City: userData.City || '',
  parishcode: userData.parishcode || '',
  parishCountry: userData.parishCountry || '',
  parishState: userData.parishState || '',
  avatar: userData.avatar || avatar1,
  avatarFile: userData.avatar,
})

const updateMember = async () => {
  try {
    // Create a FormData object
    const formData = new FormData()

    // Append all form fields to the FormData object
    formData.append('email', form.value.email)
    formData.append('sname', form.value.sname)
    formData.append('fname', form.value.fname)
    formData.append('mname', form.value.mname)
    formData.append('Gender', form.value.Gender)
    formData.append('dob', form.value.dob)
    formData.append('mobile', form.value.mobile)
    formData.append('Altmobile', form.value.Altmobile)
    formData.append('Residence', form.value.Residence)
    formData.append('Country', form.value.preSelectedCountry)
    formData.append('State', form.value.preSelectedState)
    formData.append('City', form.value.City)
    formData.append('Title', form.value.Title)
    formData.append('dot', form.value.dot)
    formData.append('MStatus', form.value.MStatus)
    formData.append('ministry', form.value.ministry)
    formData.append('Status', form.value.Status)
    formData.append('parishcode', form.value.parishcode)
    formData.append('parishname', form.value.parishname)

    // Only append the file if one is selected
    if (form.value.avatarFile) {
      formData.append('thumbnail', form.value.avatarFile)
    }
    alert(formData.get('Status'))


    // Make the API request
    const response = await api.post(`/member/${userData.UserId}/update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Member updated successfully', JSON.stringify(response.data))

    const apiResponseDetails = response.data

    apiResponseStatus.value = apiResponseDetails.status
    apiResponseMessage.value = apiResponseDetails.message

  } catch (error) {
    // Handle any errors
    console.error('Error updating member:', error.response ? error.response.data : error.message)
  }
}


const onSubmit = message => {
  if (message) {
    updateMember()
  }
}


const fetchCountries = async () => {
  const cachedCountries = localStorage.getItem('countries');

  if (cachedCountries) {
    // If the data exists, load it from localStorage
    console.log('Loaded countries from localStorage', JSON.parse(cachedCountries));
    
    form.value.countryList = JSON.parse(cachedCountries).map((country) => ({
      id: country.id,
      name: country.name,
      flag_img: country.flag_img,
      states: country.states,
    }));
  } else {
    // If not available, fetch from API and store in localStorage
    allAdminActions
      .fetchCountries()
      .then((response) => {
        const data = response.data;
        console.log('This is my data', data);

        if (data.countries && data.countries.length > 0) {
          // Store fetched countries in localStorage
          localStorage.setItem('countries', JSON.stringify(data.countries));

          form.value.countryList = data.countries.map((country) => ({
            id: country.id,
            name: country.name,
            flag_img: country.flag_img,
            states: country.states,
          }));
        }
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }
};

const getResidentialState = () => {
  console.log("<=========This is the country name picked for residential==========>", form.value.preSelectedCountry)
  console.log("<=========This is the country list==========>", form.value.countryList)

  if (form.value.preSelectedCountry) {
    form.value.getCountryById = form.value.countryList.find(country => country.name === form.value.preSelectedCountry)
    console.log("<=========This is the country picked for residential==========>", form.value.getCountryById)
    form.value.Country = form.value.getCountryById ? form.value.getCountryById.name : ''

    if (form.value.getCountryById && Array.isArray(form.value.getCountryById.states) && form.value.getCountryById.states.length > 0) {
      try {
        const data = form.value.getCountryById.states

        form.value.stateList = data.map(countryState => ({
          country_id: countryState.country_id,
          name: countryState.name,
        }))
      } catch (error) {
        console.error("Error processing states:", error)
      }
    } else {
      form.value.stateList = []
    }
  } else {
    form.value.stateList = []
  }
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

const  getGenderTitle = () => {
  if (form.value.Gender) {
    const gender = form.value.Gender

    getTitleByGender(gender)
  }
}

const fetchMinistryFromApi = async () => {
  allAdminActions.fetchMinistryFromApi({
  }).then(response => {
    const data=response.data
    
    // form.value.ministry = data.ministry

    if (data.ministry && data.ministry.length > 0) {
      form.value.ministryList = data.ministry.map(ministry => ministry.ministry)
    }

  }).catch(error => {
    console.error(error)
  })
}


watchEffect(() => {
  getResidentialState()
  getGenderTitle()
})

onMounted(() => {
  fetchMinistryFromApi()
  fetchCountries()
})


const refInputEl = ref()
const isConfirmDialogOpen = ref(false)
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || 'Please confirm account deactivation']

const resetForm = () => {
  form.value = structuredClone(form)
}

const resetAvatar = () => {
  form.value.avatar = userData.avatar || avatar1
}
    
const changeAvatar = file => {
  const { files } = file.target
  if (files && files.length) {
    form.value.avatarFile = files[0]

    const fileReader = new FileReader()

    fileReader.readAsDataURL(files[0])
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string')
        form.value.avatar = fileReader.result
    }
  }
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Profile Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            size="100"
            class="me-6"
            :image="form.avatar"
          />

          <!-- 👉 Upload Photo -->
          <form class="d-flex flex-column justify-center gap-4">
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="tabler-cloud-upload"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="secondary"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Reset</span>
                <VIcon
                  icon="tabler-refresh"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </form>
        </VCardText>

        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="4"
                cols="12"
              >
                <AppTextField
                  v-model="form.fname"
                  label="First Name"
                />
              </VCol>

              <!-- 👉 Middle Name -->
              <VCol
                md="4"
                cols="12"
              >
                <AppTextField
                  v-model="form.mname"
                  label="Middle Name"
                />
              </VCol>

              <!-- 👉 Last Name -->
              <VCol
                md="4"
                cols="12"
              >
                <AppTextField
                  v-model="form.sname"
                  label="Last Name"
                />
              </VCol>

              <!-- 👉 Email -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="form.email"
                  label="E-mail"
                  type="email"
                />
              </VCol>

              <!-- 👉 Phone -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="form.mobile"
                  label="Phone Number"
                />
              </VCol>

              <!-- 👉 Alt Phone -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="form.Altmobile"
                  label="Alternate Phone Number"
                />
              </VCol>

              <!-- 👉 dob -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="form.dob"
                  type="date"
                  label="Date of birth"
                />
              </VCol>

              <!-- 👉 Address -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="form.Residence"
                  label="Address"
                />
              </VCol>

              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="form.dot"
                  type="date"
                  label="Date of first anointment"
                />
              </VCol>

              <!-- 👉 Country -->
              <VCol
                cols="12"
                md="6"
              >
                <VAutocomplete
                  v-model="form.preSelectedCountry"
                  label="Country"
                  :items="form.countryList"
                  item-title="name"
                  item-value="name"
                  density="compact"
                  variant="outlined"
                  @change="getResidentialState"
                />
              </VCol>


              <!-- 👉 State -->
              <VCol
                cols="12"
                md="6"
              >
                <VAutocomplete
                  v-model="form.State"
                  label="State"
                  :items="form.stateList"
                  item-title="name"
                />
              </VCol>

              <!-- 👉 City -->
              <VCol
                cols="12"
                md="4"
              >
                <AppTextField
                  v-model="form.City"
                  label="City"
                />
              </VCol>

              <!-- 👉 Language -->
              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  v-model="form.Title"
                  label="Present Title"
                  :items="form.titleList"
                />
              </VCol>

              <!-- 👉 Status -->
              <VCol
                cols="12"
                md="4"
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
                md="4"
              >
                <AppSelect
                  v-model="form.Status"
                  label="Vineyard Status"
                  placeholder=" Select Vineyard status "
                  :items="['Shepherd','Asst. Shepherd','Wolider','Wolima','Church Worker','Pastor']"
                />
              </VCol>

              <!-- 👉 Ministry -->
              <VCol
                cols="12"
                md="4"
              >
                <AppSelect
                  id="ministrySelect"
                  v-model="form.ministry"
                  label="Ministry"
                  :items="form.ministryList"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="isConfirmDialogVisible = true">
                  Save changes
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  @click.prevent="resetForm"
                >
                  Reset
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to confirm this edit Did you want to continue ?"
    cancel-msg="Edit Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Updated Successfully!"
    @confirm="onSubmit"
    @cancel="onCancel"
  />
</template>
