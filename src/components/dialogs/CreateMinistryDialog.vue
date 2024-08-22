<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { onMounted, ref } from 'vue'



const props = defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  ministryData: {
    type: Object,
    required: true,
    default: () => ({}),  
  },
  isDialogVisible: {
    type: Boolean,
    required: true,

    // default: false,  // Default to false if not provided
  },
})


const emit = defineEmits([
  'update:isDialogVisible',
  'updatedData',
])

const AllAdminActions = useAllAdminActions()

// const titleName = ref([])
const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = ref([])

const form = ref({
  id: '',
  ministry: '',
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
    try {
      // Call the endpoint to add the title
      api.post('/AddMinistry', {
        ministry: form.value.ministry,
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


// onMounted(() => {
//   //GET userData from local storage---->
//   userData.value = JSON.parse(localStorage.getItem('userData'))
//   form.value.status=userData.value.status//pass parishname from userdata to form parishname
//   form.value.level=userData.value.level//
//   form.value.title=userData.value.title//
//   form.value.gender=userData.value.gender//

// })


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
          Provide data with this form to create a new title.
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
                      v-model="form.ministry"
                      label="Enter Ministry Name"
                      variant="outlined" 
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
    confirmation-question="You are about to confirm this ministry Did you want to continue ?"
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
