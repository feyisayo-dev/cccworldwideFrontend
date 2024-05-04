<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
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

const AllAdminActions = useAllAdminActions()
const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = ref([])

const form = ref({

  parishName: '',
  parishcode: '',
  from: '',
  to: '',
  committeeName: '',

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

  if (message) {//if true

    try{
      //called the endpoint to add committee
      api.post('/addcommittee', {
        committename: form.value.committeeName,
        parishcode: form.value.parishcode,
        from: form.value.from,
        to: form.value.to,
      }).then(response => {

        const apiResponseDetails=response.data

        // console.log('request==> ', JSON.stringify(response.data))

        apiResponseStatus.value=apiResponseDetails.status
        apiResponseMessage.value=apiResponseDetails.message

      }).catch(e => {
       
        console.log(e)
        
      })

   
    }  catch (error) {
      console.error('Error:', error)
    }
      
       
   
  }
}

onMounted(() => {
  //GET userData from local storage---->
  userData.value = JSON.parse(localStorage.getItem('userData'))
  form.value.parishName=userData.value.parishname//pass parishname from userdata to form parishname
  form.value.parishcode=userData.value.parishcode//


})



const isConfirmDialogVisible = ref(false)

// Define a computed property to concatenate the prefix with parishName
// const prefixedParishName = computed({
//   get() {
//     return 'CCC-' + form.value.parishName
//   },
// })
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
          Create New Committee
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create a new committee.
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
                <VCol cols="12">
                  <VTextField
                    v-model="form.parishName"
                    prefix="CCC-"
                    label="Enter Parish Name"
                    variant="outlined"
                    readonly 
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="form.committeeName"
                    label="Enter committee name"
                    variant="outlined"
                  />
                </VCol>
              

                <VCol cols="12">
                  <AppTextField
                    v-model="form.from"
                    type="date"
                    label="Enter committee start date"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.to"
                    type="date"
                    label="Enter committee end date"
                  />
                </VCol>
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
