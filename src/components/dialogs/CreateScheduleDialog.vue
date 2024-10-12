<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { onMounted, ref } from 'vue'



const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,

    // default: false,  // Default to false if not provided
  },
})


const emit = defineEmits([
  'update:isDialogVisible',
  'changes',
  'updatedData',
])

const AllAdminActions = useAllAdminActions()

// const titleName = ref([])
const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = JSON.parse(localStorage.getItem('userData') || 'null')


const form = ref({
  parishcode: '' || userData.parishcode,
  parishname: '' || userData.parishname,
  event: '',
  person: '',
  date: '',
  day: '',
  members: '',
  Malemembers: '',
  Femalemembers: '',
})

const dialogVisibleUpdate = val => {
  emit('update:isDialogVisible', val)
  currentStep.value = 0
}

watch(props, () => {
  if (!props.isDialogVisible)
    currentStep.value = 0
})

const fetchMembersbyParish = message => {
  if (message) {
    try {
      api.get(`/Fetchmemberbyparish/${userData.parishcode}`)
        .then(response => {
          // Ensure response.data.records is correctly set
          form.value.members = response.data.records.map(member => ({
            ...member,
            MemberName: `${member.fname} ${member.mname ? member.mname + ' ' : ''}${member.sname}`,
          }))
          console.log("This is the member", form.value.members)

          // Filter and map the members to separate males and females
          form.value.Malemembers = form.value.members
            .filter(member => member.Gender === 'Male')
            .map(member => ({
              ...member,
              fullName: `${member.fname} ${member.mname ? member.mname + ' ' : ''}${member.sname}`,
            }))

          form.value.Femalemembers = form.value.members
            .filter(member => member.Gender === 'Female')
            .map(member => ({
              ...member,
              fullName: `${member.fname} ${member.mname ? member.mname + ' ' : ''}${member.sname}`,
            }))

          console.log("This is the separation by gender", "Male:", form.value.Malemembers, "Female:", form.value.Femalemembers)
        })
        .catch(error => {
          console.error("Error submitting data:", error)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

watchEffect(fetchMembersbyParish)

const onSubmit = message => {
  if (message) {
    try {
    const parishCode = userData.parishcode || 'default_parish_code'
      api.post(`/AddSchedule/${parishCode}`, {
        parishcode: form.value.parishcode,
        event: form.value.event,
        person: form.value.person,
        date: form.value.date,
      })
        .then(response => {
          const apiResponseDetails = response.data

          // Perform necessary actions with the response data
          apiResponseStatus.value = apiResponseDetails.status
          apiResponseMessage.value = apiResponseDetails.message

          if (apiResponseStatus.value === 200) {
            emit('changes')
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
          Create New Schedule
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create a new Schedule.
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
                      v-model="form.parishname"
                      label="Your parish name"
                      variant="outlined"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.event"
                      label="Enter event name"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol 
                    cols="12" 
                    md="6"
                  >
                    <VAutocomplete
                      v-model="form.person"
                      :items="form.members"
                      label=" Select member to lead service"
                      variant="outlined"
                      item-title="MemberName"
                      item-value="MemberName"
                    />
                  </VCol>
                
                  <VCol 
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.date"
                      label="Pick date"
                      variant="outlined"
                      type="date"
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
    confirmation-question="You are about to confirm this Schedule Did you want to continue ?"
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
