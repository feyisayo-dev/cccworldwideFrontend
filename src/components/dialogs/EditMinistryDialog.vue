<!-- eslint-disable vue/no-mutating-props -->
<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import laptopGirl from '@images/illustrations/laptop-girl.png'
import { onMounted, ref } from 'vue'




const props = defineProps({
  ministryData: {
    type: Object,
    required: true,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:isDialogVisible',
  'updatedData',
])

const allAdminActions = useAllAdminActions()

const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')

const form = ref({
  id: '',
  ministry: '',
})

const createApp = [
  {
    icon: 'custom-home',
    title: 'Details',

    // subtitle: 'Enter  Parish Details',
  },

  // {
  //   icon: 'tabler-check',
  //   title: 'Catergory',

  //   // subtitle: 'Select Catergory',
  // },

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

    UpdateMinistry (form.value.id, form.value.ministry)
    
  }

}

const selectedRadio = ref('primary')

const colorsRadio = [
  'National',
  'State',
  'Area',
  'Province',
  'Circuit',
  'District',
  'Parish',
]


//FetchAll 
const UpdateMinistry = async (id, ministry) => {
  console.log("This is the data gotten", ministry, id)

  const postData = {
    ministry: ministry,
    id: id,
  }

  try {
    const response = await allAdminActions.updateMinistry(postData)
    
    const apiStatus = response.data

    console.log("API Response:", apiStatus)

    apiResponseStatus.value = apiStatus.status
    if(apiResponseStatus.value === '200'){
      
    }
    apiResponseMessage.value = apiStatus.message
  } catch (error) {
    console.error("Error submitting data:", error)

  }
}





onMounted(() => {
  // fetchCountries()
 
})


watchEffect(() => {
  
  // fetchAllMinistry()

})

const isConfirmDialogVisible = ref(false)





watchEffect(() => {
  if (props.ministryData) {
    form.value.id = props.ministryData.id 
    form.value.ministry = props.ministryData.ministry
  }
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
          Edit Ministry Details
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create a edit ministry.
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
              <!-- 👉 category -->
              <VWindowItem>
                <VCol cols="12">
                  <VTextField
                    v-model="form.ministry"
                    label="Enter Ministry Name"
                    variant="outlined"
                    autofocus
                  />
                </VCol>
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
              </vwindowitem>
            </VWindow>

            <div class="d-flex justify-space-between mt-8">
              <VBtn
                color="success"
                @click="isConfirmDialogVisible = true"
              >
                Update
                <VIcon
                  icon="tabler-check"
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
    confirmation-question="You are about to update  this ministry info Did you want to continue ?"
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
