<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { onMounted, ref } from 'vue'



const props = defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  TitleData: {
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

  gender: '',
  title: '',
  status: '',
  level: '',
  p1: '',
  p2: '',
  p3: '',
  p4: '',
  p5: '',
  p6: '',
  p7: '',
  p8: '',
  p9: '',
  genderList: Object.freeze(['Male', 'Female']),
})


// const fetchAllTitle = () => {
//   AllAdminActions.fetchAlltitle({
//     // q: searchQuery.value,
//     // status: selectedStatus.value,
//     // plan: selectedPlan.value,
//     // role: selectedRole.value,
//     // options: options.value,
//   }).then(response => {
//     // Title.value = response.data.allTitle
 
//     const processedTitles = response.data.titles.map(title => {
//       const sum = (parseInt(title.p1) || 0) + (parseInt(title.p2) || 0) + (parseInt(title.p3) || 0) + (parseInt(title.p4) || 0) + (parseInt(title.p5) || 0) + (parseInt(title.p6) || 0) + (parseInt(title.p7) || 0) + (parseInt(title.p8) || 0) + (parseInt(title.p9) || 0)

//       return { ...title, amount: sum }
//     })

//     titleName.value = processedTitles


//     // totalPage.value = response.data.totalPage
//     // totalTitle.value = response.data.totalTitle
//     // options.value.page = response.data.page
//     console.log("this is the title value", processedTitles)
//   }).catch(error => {
//     console.error(error)
//   })
// }

// watchEffect(fetchAllTitle)

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
      api.post('/Addtitle', {
        gender: form.value.gender,
        title: form.value.title,
        status: form.value.status,
        level: form.value.level,
        p1: form.value.p1,
        p2: form.value.p2,
        p3: form.value.p3,
        p4: form.value.p4,
        p5: form.value.p5,
        p6: form.value.p6,
        p7: form.value.p7,
        p8: form.value.p8,
        p9: form.value.p9,
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


onMounted(() => {
  //GET userData from local storage---->
  userData.value = JSON.parse(localStorage.getItem('userData'))
  form.value.status=userData.value.status//pass parishname from userdata to form parishname
  form.value.level=userData.value.level//
  form.value.title=userData.value.title//
  form.value.gender=userData.value.gender//

})




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
                      v-model="form.title"
                      label="Enter Title Name"
                      variant="outlined" 
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VSelect
                      v-model="form.status"
                      label="Enter status"
                      variant="outlined"
                      :items="['Member/Laity', 'Vineyard Worker']"
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol 
                    cols="12" 
                    md="6"
                  >
                    <VSelect
                      v-model="form.gender"
                      :items="form.genderList"
                      label=" Select your gender"
                      outlined
                    />
                  </VCol>
                
                  <VCol 
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.level"
                      label="Enter level"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol 
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p1"
                      label="Enter Anointing fee"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p2"
                      label="Enter Imeko Levy"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol 
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p3"
                      label="Enter Bible Lesson Fees"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>

                <VRow>
                  <VCol 
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p4"
                      label="1 Candle Fess"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p5"
                      label="Enter Imeko Mercy Land"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol 
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p6"
                      label="Enter Evangelism Contribution"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>

                <VRow>
                  <VCol 
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p7"
                      label="Enter Convocation"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p8"
                      label="Enter 1 Block Levy"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol 
                    cols="12"
                    md="4"
                  >
                    <VTextField
                      v-model="form.p9"
                      label="Enter Other Contribution"
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
