<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import laptopGirl from '@images/illustrations/laptop-girl.png'
import { onMounted, ref } from 'vue'



const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'updatedData',
])



const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')

const form = ref({
  countryList: [],
  stateList: [],
  parishList: [],
  selectedCountry: ' ',
  selectedState: '',
  seletedParish: '',
  parishCategory: '',
  parishName: '',
  parishEmail: '',
  parishPhone1: '',
  parishPhone2: '',
  parishAddress: '',
  city: '',
  prefixedParishName: '',


})

const createApp = [
  {
    icon: 'custom-home',
    title: 'Details',

    // subtitle: 'Enter  Parish Details',
  },
  {
    icon: 'tabler-check',
    title: 'Catergory',

    // subtitle: 'Select Catergory',
  },

  // {
  //   icon: 'tabler-database',
  //   title: 'Database',
  //   subtitle: 'Select Database',
  // },
  // {
  //   icon: 'tabler-credit-card',
  //   title: 'Billing',
  //   subtitle: 'Payment Details',
  // },
  // {
  //   icon: 'tabler-check',
  //   title: 'Submit',
  //   subtitle: 'submit',
  // },
]

const categories = [
  {
    icon: 'tabler-briefcase',
    color: 'info',
    title: 'National Parish',
    subtitle: 'First Level Parish',
    slug: 'National',
  },
  {
    icon: 'tabler-shopping-cart',
    color: 'success',
    title: 'State Parish',
    subtitle: 'Grow Your Business With App',
    slug: 'State',
  },
  {
    icon: 'tabler-device-laptop',
    color: 'error',
    title: 'Area Parish',
    subtitle: 'Start learning today',
    slug: 'Area',
  },
  {
    icon: 'tabler-device-laptop',
    color: 'error',
    title: 'Province',
    subtitle: 'Start learning today',
    slug: 'Province',
  },
  {
    icon: 'tabler-device-laptop',
    color: 'error',
    title: 'Circuit',
    subtitle: 'Start learning today',
    slug: 'Circuit',
  },
  {
    icon: 'tabler-device-laptop',
    color: 'error',
    title: 'District',
    subtitle: 'Start learning today',
    slug: 'District',
  },
  {
    icon: 'tabler-device-laptop',
    color: 'error',
    title: 'Parish',
    subtitle: 'Start learning today',
    slug: 'Parish',
  },
]

const frameworks = [
  {
    icon: 'tabler-brand-react-native',
    color: 'info',
    title: 'React Native',
    subtitle: 'Create truly native apps',
    slug: 'react-framework',
  },
  {
    icon: 'tabler-brand-angular',
    color: 'error',
    title: 'Angular',
    subtitle: 'Most suited for your application',
    slug: 'angular-framework',
  },
  {
    icon: 'tabler-brand-html5',
    color: 'warning',
    title: 'HTML',
    subtitle: 'Progressive Framework',
    slug: 'html-framework',
  },
  {
    icon: 'tabler-brand-python',
    color: 'primary',
    title: 'Python',
    subtitle: 'js web frameworks',
    slug: 'js-framework',
  },
]

const databases = [
  {
    icon: 'tabler-brand-firebase',
    color: 'error',
    title: 'Firebase',
    subtitle: 'Cloud Firestore',
    slug: 'firebase-database',
  },
  {
    icon: 'tabler-brand-amazon',
    color: 'warning',
    title: 'AWS',
    subtitle: 'Amazon Fast NoSQL Database',
    slug: 'aws-database',
  },
  {
    icon: 'tabler-database',
    color: 'info',
    title: 'MySQL',
    subtitle: 'Basic MySQL database',
    slug: 'mysql-database',
  },
]

const createAppData = ref({
  category: 'crm-application',
  framework: 'vue-framework',
  database: 'firebase-database',
  cardNumber: null,
  cardName: '',
  cardExpiry: '',
  cardCvv: '',
  isSave: false,
})

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
  currentStep.value = 0
}

watch(props, () => {
  if (!props.isDialogVisible)
    currentStep.value = 0
})

const onSubmit = message => {

  if (message) {

    const response =   addNewParish (form.value.parishName, form.value.parishEmail, form.value.parishPhone1, form.value.parishPhone2, form.value.parishAddress, form.value.parishCategory, form.value.selectedCountry, form.value.selectedState, form.value.city, form.value.seletedParish )
      .then(response => {

        // console.log("Get Add parish response  here now", JSON.stringify(response.data))
        const apiStatus=response.data

        console.log("Get Add parish response here now", JSON.stringify(apiStatus.status))

        apiResponseStatus.value=apiStatus.status
        apiResponseMessage.value=apiStatus.message

       
      }).catch(e => {
        // const { errors: formErrors } = e.response.data

        // errors.value = formErrors
        // console.error(e.response.data)
      })

    
    

  }
}

const selectedRadio = ref('primary')

const parishLevel = [
  'National',
  'State',
  'Area',
  'Province',
  'Circuit',
  'District',
  'Parish',
]

const allAdminActions = useAllAdminActions()


// 👉 FetchAll country from adminAction
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

// 👉 FetchAll country  State by CountryId from adminAction
const fetchStates = async () => {
  form.value.stateList = []
  
  if (form.value.selectedCountry) {

    // alert(form.value.selectedCountry)

    // form.value.selectedState = 'Select parish state'

    const response = await allAdminActions.fetchStateByCountry(form.value.selectedCountry)
    if (response && Array.isArray( response) && response.length > 0) {
      try {
        const data= response
      
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
}


// 👉 FetchAll parish from state
const fetchParish = async () => {


  if ((form.value.selectedState)) {
    try{
      form.value.parishList=[]
      form.value.seletedParish='Select parish'
      console.log( 'State selected', form.value.selectedState)

      const response = await allAdminActions.fetchStateParish(form.value.selectedState)
      
      console.log( 'State selected', response)
      
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
      console.log( form.value.parishList)

    }catch (error) {
      console('Error fetching data:')
    }

   



  }
}


//Add parish
const addNewParish =   (parishName, parishEmail, parishPhone1, parishPhone2, parishAddress, category, selectedCountry, selectedState, city, selectedParish ) => {

 
  const postData = {
    email: parishEmail,
    phone1: parishPhone1,
    phone2: parishPhone2,
    country: selectedCountry,
    category: category,
    state: selectedState,
    city: city,
    address: parishAddress,
    name: parishName,
    reportTo: selectedParish,
  }
  

  try {
   
    return  allAdminActions.addNewParish(postData)
    
   

  } catch (error) {
    // throw new Error('Failed to fetch parish by state')
  }

 

}




onMounted(() => {
  fetchCountries()
})


watchEffect(() => {
  fetchStates()
  fetchParish()

})

const isConfirmDialogVisible = ref(false)

// Define a computed property to concatenate the prefix with parishName
const prefixedParishName = computed({
  get() {
    return 'CCC-' + form.value.parishName
  },
})
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="950"
    @update:model-value="dialogVisibleUpdate"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn
      size="small"
      @click="emit('update:isDialogVisible', false)"
    />
    <VCard class="create-app-dialog">
      <VCardText class="pa-5 pa-sm-10">
        <h5 class="text-h5 text-center mb-2">
          Create Parish
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create a new parish.
        </p>

        <VRow>
          <VCol
            cols="6"
            sm="3"
          >
            <AppStepper
              v-model:current-step="currentStep"
              direction="vertical"
              :items="createApp"
              icon-size="24"
              class="stepper-icon-step-bg"
            />
          </VCol>

          <VCol
            cols="18"
            sm="7"
            md="8"
            lg="9"
          >
            <VWindow
              v-model="currentStep"
              class="disable-tab-transition stepper-content"
            >
              <!-- 👉 details -->
              <VWindowItem>
                <VCol cols="12">
                  <VTextField
                    v-model="form.parishName"
                    prefix="CCC-"
                    label="Enter Parish Name"
                    variant="outlined"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="form.parishEmail"
                    label="Enter Parish Official email address"
                    variant="outlined"
                  />
                </VCol>
                <VCol cols="12">
                  <VPhoneInput
                    v-model="form.parishPhone1"
                    label="Official Phone Number"
                    country-label="Phone Number"
                    country-aria-label="Country for phone number"
                    default-country="NG"
                    invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                  />
                </VCol>

                <VCol cols="12">
                  <VPhoneInput
                    v-model="form.parishPhone2"
                    label="Alternative Phone number"
                    country-label="Phone Number"
                    country-aria-label="Country for phone number"
                    default-country="NG"
                    invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    v-model="form.parishAddress"
                    label="Enter Parish Address"
                    rows="2"
                    variant="outlined"
                  />
                </VCol>
                <!--
                  <VRadioGroup v-model="createAppData.category">
                  <VList class="card-list">
                  <VListItem
                  v-for="category in categories"
                  :key="category.title"
                  @click="createAppData.category = category.slug"
                  >
                  <template #prepend>
                  <VAvatar
                  size="48"
                  rounded
                  variant="tonal"
                  :color="category.color"
                  :icon="category.icon"
                  />
                  </template>

                  <VListItemTitle class="mb-1">
                  {{ category.title }}
                  </VListItemTitle>
                  <VListItemSubtitle>
                  {{ category.subtitle }}
                  </VListItemSubtitle>

                  <template #append>
                  <VRadio :value="category.slug" />
                  </template>
                  </VListItem>
                  </VList>
                  </VRadioGroup>
                -->
              </VWindowItem>

              <!-- 👉 Frameworks -->
              <VWindowItem>
                <h6 class="text-h6 mb-4">
                  Select Parish Category/Level
                </h6>
                <VDivider />
                <VRadioGroup
                  v-model="form.parishCategory"
                  inline
                >
                  <div>
                    <VRadio
                      v-for="parish in parishLevel"
                      :key="parish"
                      :label="parish"
                      :value="parish.toLocaleLowerCase()"
                    />
                  </div>
                </VRadioGroup>
                <VDivider />
                <VCol cols="12">
                  <VAutocomplete
                    v-model="form.selectedCountry"
                    label="Country"
                    :items="form.countryList"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    variant="outlined"
                    @change="fetchStates"
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
                <VCol cols="12">
                  <AppSelect
                    v-model="form.selectedState"
                    label="State"
                    :items="form.stateList"
                    item-title="name"
                    @change="fetchParish"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.city"
                    label="City"
                    placeholder="Enter Parish City"
                  />
                </VCol>
                <!--
                  <VCol cols="12">
                  <span style="color: rgb(26, 196, 26);">Parish Address :{{ form.parish }}</span>
                  <AppSelect
                  v-model="form.seletedParish"
                  label="Parish"
                  clearable
                  :items="form.parishList"
                  item-value="parishcode"
                  :item-title="item => `${item.name}-${item.parishaddress}`"
                  :hint="`${form.seletedParish}`"
                  persistent-hint
                  double-line
                  />
                  </VCol>
                -->

               
                <VCol
      
                  v-if="form.parishCategory !='national' && form.parishCategory !=''"
                  cols="12"
                >
                  <!--
                    <span style="color: rgb(26, 196, 26);">Parish Address :{{ form.parish }}</span> 
                 
                    <VAutocomplete
                    v-model="form.seletedParish"
                    label=" Select Parish"
                    :items="form.parishList"
                    item-value="id"
                    item-title="name"
                    :hint="`Address:${form.seletedParish}`"
                    persistent-hint
                    double-line
                    />
                  -->
                  <VAutocomplete
                    v-model="form.seletedParish"
                    label=" Select Parish "
                    :items="form.parishList"
                    item-value="parishcode"
                    :item-title="item => `${item.name}-${item.parishaddress}`"
                    :hint="`${form.seletedParish}`"
                    persistent-hint
                    double-line
                  />
                </VCol>
              </VWindowItem>

              <!-- 👉 Database Engine -->
              <VWindowItem>
                <AppTextField label="Database Name" />

                <h6 class="text-h6 my-4">
                  Select Database Engine
                </h6>
                <VRadioGroup v-model="createAppData.database">
                  <VList class="card-list">
                    <VListItem
                      v-for="database in databases"
                      :key="database.title"
                      @click="createAppData.database = database.slug"
                    >
                      <template #prepend>
                        <VAvatar
                          size="48"
                          rounded
                          variant="tonal"
                          :color="database.color"
                        >
                          <VIcon :icon="database.icon" />
                        </VAvatar>
                      </template>
                      <VListItemTitle class="mb-1">
                        {{ database.title }}
                      </VListItemTitle>
                      <VListItemSubtitle>
                        {{ database.subtitle }}
                      </VListItemSubtitle>
                      <template #append>
                        <VRadio :value="database.slug" />
                      </template>
                    </VListItem>
                  </VList>
                </VRadioGroup>
              </VWindowItem>

              <!-- 👉 Billing form -->
              <VWindowItem>
                <h6 class="text-h6 mb-4">
                  Payment Details
                </h6>

                <VForm>
                  <VRow>
                    <VCol cols="12">
                      <AppTextField
                        v-model="createAppData.cardNumber"
                        label="Card Number"
                        type="number"
                      />
                    </VCol>

                    <VCol
                      cols="12"
                      md="6"
                    >
                      <AppTextField
                        v-model="createAppData.cardName"
                        label="Name on Card"
                      />
                    </VCol>

                    <VCol
                      cols="6"
                      md="3"
                    >
                      <AppTextField
                        v-model="createAppData.cardExpiry"
                        label="Expiry"
                      />
                    </VCol>

                    <VCol
                      cols="6"
                      md="3"
                    >
                      <AppTextField
                        v-model="createAppData.cardCvv"
                        label="CVV"
                      />
                    </VCol>

                    <VCol cols="12">
                      <VSwitch
                        v-model="createAppData.isSave"
                        label="Save Card for future billing?"
                      />
                    </VCol>
                  </VRow>
                </VForm>
              </VWindowItem>

              <VWindowItem class="text-center">
                <h6 class="text-h6 mb-2">
                  Submit 🥳
                </h6>
                <p class="text-sm mb-6">
                  Submit to kickstart your project.
                </p>

                <VImg
                  :src="laptopGirl"
                  width="176"
                  class="mx-auto"
                />
              </VWindowItem>
            </VWindow>

            <div class="d-flex justify-space-between mt-8">
              <VBtn
                variant="tonal"
                color="secondary"
                :disabled="currentStep === 0"
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
                v-if="createApp.length - 1 === currentStep"
                color="success"
                @click="isConfirmDialogVisible = true"
              >
                submit
                <VIcon
                  icon="tabler-check"
                  end
                  class="flip-in-rtl"
                />
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
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to confirm this registration Did you want to continue ?"
    cancel-msg="Registration Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Registered!"
    @confirm="onSubmit"
    @cancel="onCancel"
  />
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 24px;
}
</style>
