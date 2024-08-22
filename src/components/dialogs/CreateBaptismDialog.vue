<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useUserListStore } from '@/apiservices/membersList'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import api from '@/apiservices/api'
import { onMounted, ref, watchEffect } from 'vue'



const props = defineProps({
  userId: {
    type: Object,
    required: true,
    default: () => ({}),  
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

const UserId = ref(null)
const Amount = ref(null)

const Year_of_Joining = ref('')

const usersTiles = ref([])

const userDetails = ref(null)

const userListStore = useUserListStore()


const fetchUserDetails = async UserId => {
  try {
    const response = await api.get(`/member/${UserId}`)

    // Assuming response.data.member is a single object
    userDetails.value = response.data.member[0]
    console.log('Fetched user details<===dialogue===>:', userDetails.value)

    // Process the user data to create the combined member name
    if (userDetails.value) {
      const memberName = `${userDetails.value.Title} ${userDetails.value.fname} ${userDetails.value.sname}`

      // If you still want to keep the processedUsers array format:
      usersTiles.value = [{ ...userDetails.value, member: memberName }]
      console.log('Fetched user details<===dialogue===> updated:', usersTiles.value)
      Amount.value ='2000'
    } else {
      console.error('No member data found.')
    }

    console.log('User details processed:', usersTiles.value)
  } catch (error) {
    console.error('Error fetching user details:', error)
  }
}

watch(
  () => props.userId,
  newUserId => {
    if (newUserId && newUserId.UserId) {
      UserId.value = newUserId.UserId
      fetchUserDetails(UserId.value) // Fetch user details when UserId is set
    }
    console.log('UserId:', UserId.value)
  },
  { immediate: true }, // Ensures the watch effect runs immediately after mounting
)

onMounted(() => {
  if (props.userId && props.userId.UserId) {
    UserId.value = props.userId.UserId
    fetchUserDetails(UserId.value) // Fetch user details on mount
  }
  console.log('Mounted UserId:', UserId.value)
})


// const titleName = ref([])
const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = ref([])

// const form = ref({
//   UserId: '',
//   Status: '',
//   Amount: '',
//   Year_of_Joining: '',

//   // genderList: Object.freeze(['Male', 'Female']),
// })

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
  currentStep.value = 0
}

watch(props, () => {
  if (!props.isDialogVisible)
    currentStep.value = 0
})


const onSubmit = async message => {
  if (message) {
    const baptismData = {
      UserId: UserId.value,
      Status: false,
      Year_of_Joining: Year_of_Joining.value,
      Amount: Amount.value,
    }

    try {
      // Call the endpoint to add the title
      api.post('/AddBaptismRecord', {
        baptismData: baptismData,
      })
        .then(response => {
          const apiResponseDetails = response.data

          // Perform necessary actions with the response data
          apiResponseStatus.value = apiResponseDetails.status
          apiResponseMessage.value = apiResponseDetails.message

          // Check status and reload
          if (apiResponseStatus.value === 200) {
            window.location.reload()
          }

        }).catch(error => {
          console.error("Error submitting data:", error)
        }).finally(() => {
          isConfirmDialogVisible.value = false

          isConfirmDialogVisible.value = false

          // Any other cleanup code can go here
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }
}




const isConfirmDialogVisible = ref(false)
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
          Create New Title/Anointing
        </h5>
        <p class="text-sm text-center mb-8">
          Provide these details to register for your baptism
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
              <!-- 👉 committee  -->
              <VWindowItem>
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      :value="usersTiles.length ? usersTiles[0].member : ''"
                      variant="outlined"
                      readonly
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol 
                    cols="12" 
                    md="6"
                  >
                    <VTextField
                      v-model="Year_of_Joining"
                      label=" Select your date of your joining your church"
                      outlined
                      type="date"
                    />
                  </VCol>
                
                  <VCol 
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="Amount"
                      label="Amount your church asks for baptism"
                      variant="outlined"
                      readonly
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
              <div class="d-flex justify-space-between mt-8">
                <VBtn
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
              </div>
            </VWindow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to confirm this title Did you want to continue ?"
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
