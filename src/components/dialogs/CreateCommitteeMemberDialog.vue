<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { onMounted, ref } from 'vue'



const props = defineProps({
  // eslint-disable-next-line vue/prop-name-casing
  churchData: {
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
  'changes',
])

// const titleName = ref([])
const currentStep = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = JSON.parse(localStorage.getItem('userData') || 'null')
const allAdminActions = useAllAdminActions()

console.log("<=======This is the UserId=========>", userData.parishcode)
console.log("<=======This is the UserId=========>", userData.parishname)

const form = ref({
  ChruchName: userData.parishname || '',
  committeName: '',
  chairmen: [''],
  chairpersons: [''],
  secretarys: [''],
  Fsecretarys: [''],
  treasurers: [''],
  Malemembers: [''],
  Femalemembers: [''],
  Mmembers: [''],
  Fmembers: [''],
  members: [''],
  committees: [],
})

const addChairman = () => {
  form.value.chairmen.push('') 
}

const removeChairman = index => {
  if (form.value.chairmen.length > 1) {
    form.value.chairmen.splice(index, 1)
  }
}

const addChairperson = () => {
  form.value.chairpersons.push('') 
}

const removeChairperson = index => {
  if (form.value.chairpersons.length > 1) {
    form.value.chairpersons.splice(index, 1)
  }
}

const addSecretary = () => {
  form.value.secretarys.push('') 
}

const removeSecretary = index => {
  if (form.value.secretarys.length > 1) {
    form.value.secretarys.splice(index, 1)
  }
}

const addFsecretarys = () => {
  form.value.Fsecretarys.push('') 
}

const removeFsecretarys = index => {
  if (form.value.Fsecretarys.length > 1) {
    form.value.Fsecretarys.splice(index, 1)
  }
}

const addTreasurers = () => {
  form.value.treasurers.push('') 
}

const removeTreasurers = index => {
  if (form.value.treasurers.length > 1) {
    form.value.treasurers.splice(index, 1)
  }
}

const addMmembers = () => {
  form.value.Mmembers.push('') 
}

const removeMmembers = index => {
  if (form.value.Mmembers.length > 1) {
    form.value.Mmembers.splice(index, 1)
  }
}

const addFmembers = () => {
  form.value.Fmembers.push('') 
}

const removeFmembers = index => {
  if (form.value.Fmembers.length > 1) {
    form.value.Fmembers.splice(index, 1)
  }
}

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

const FetchCommittees = async() => {
  try {
    const response = await allAdminActions.getCommittee(userData.parishcode)

    console.log("This is the response from committee", response.data)
    if (response && response.data) {
      form.value.committees = response.data.committee 
    }
  } catch (error) {
    console.error('Error:', error)
  }
}


watchEffect(fetchMembersbyParish)
watchEffect(FetchCommittees)


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
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VTextField
                      v-model="form.ChruchName"
                      label="Chruch Name"
                      variant="outlined"
                      readonly
                    />
                  </VCol>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <VAutocomplete
                      v-model="form.committees"
                      label="Committee Name"
                      variant="outlined"
                      item-title="committeName"   
                      item-value="committeRefno"  
                    />
                  </VCol>
                </VRow>
                <VRow
                  v-for="(chairman, index) in form.chairmen"
                  :key="index"
                >
                  <VCol
                    cols="10"
                    md="4"
                  >
                    <VAutocomplete
                      v-model="form.chairmen[index]"
                      :items="form.Malemembers"
                      :label="`Chairman ${index + 1}`"
                      variant="outlined"
                      item-title="fullName"   
                      item-value="UserId"    
                      return-object
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn
                      icon
                      @click="removeChairman(index)"
                    >
                      <VIcon
                        icon="tabler-minus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>

                <!-- Button to add new chairman -->
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      icon
                      @click="addChairman"
                    >
                      <VIcon
                        icon="tabler-plus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
                <VRow
                  v-for="(chairperson, index) in form.chairpersons"
                  :key="index"
                >
                  <VCol
                    cols="10"
                    md="4"
                  >
                    <VAutocomplete
                      v-model="form.chairpersons[index]"
                      :items="form.Femalemembers"
                      :label="`Chrairperson ${index + 1}`"
                      variant="outlined"
                      item-title="fullName"   
                      item-value="UserId"    
                      return-object
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn
                      icon
                      @click="removeChairperson(index)"
                    >
                      <VIcon
                        icon="tabler-minus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
                <!-- Button to add new chairperson -->
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      icon
                      @click="addChairperson"
                    >
                      <VIcon
                        icon="tabler-plus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>

                <VRow
                  v-for="(secretary, index) in form.secretarys"
                  :key="index"
                >
                  <VCol
                    cols="10"
                    md="4"
                  >
                    <VAutocomplete
                      v-model="form.secretarys[index]"
                      :items="form.members"
                      :label="`secretary ${index + 1}`"
                      variant="outlined"
                      item-title="MemberName"   
                      item-value="UserId"    
                      return-object
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn
                      icon
                      @click="removeSecretary(index)"
                    >
                      <VIcon
                        icon="tabler-minus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
                <!-- Button to add new chairperson -->
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      icon
                      @click="addSecretary"
                    >
                      <VIcon
                        icon="tabler-plus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>

                <VRow
                  v-for="(Fsecretary, index) in form.Fsecretarys"
                  :key="index"
                >
                  <VCol
                    cols="10"
                    md="4"
                  >
                    <VAutocomplete
                      v-model="form.Fsecretarys[index]"
                      :items="form.members"
                      :label="`Financial secretary ${index + 1}`"
                      variant="outlined"
                      item-title="MemberName"   
                      item-value="UserId"    
                      return-object
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn
                      icon
                      @click="removeFsecretarys(index)"
                    >
                      <VIcon
                        icon="tabler-minus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
                <!-- Button to add new chairperson -->
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      icon
                      @click="addFsecretarys"
                    >
                      <VIcon
                        icon="tabler-plus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>

                <VRow
                  v-for="(treasurer, index) in form.treasurers"
                  :key="index"
                >
                  <VCol
                    cols="10"
                    md="4"
                  >
                    <VAutocomplete
                      v-model="form.treasurers[index]"
                      :items="form.members"
                      :label="`Treasurer ${index + 1}`"
                      variant="outlined"
                      item-title="MemberName"   
                      item-value="UserId"    
                      return-object
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn
                      icon
                      @click="removeTreasurers(index)"
                    >
                      <VIcon
                        icon="tabler-minus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
                <!-- Button to add new chairperson -->
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      icon
                      @click="addTreasurers"
                    >
                      <VIcon
                        icon="tabler-plus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>

                <VRow
                  v-for="(Mmember, index) in form.Mmembers"
                  :key="index"
                >
                  <VCol
                    cols="10"
                    md="4"
                  >
                    <VAutocomplete
                      v-model="form.Mmembers[index]"
                      :items="form.Malemembers"
                      :label="`Male member ${index + 1}`"
                      variant="outlined"
                      item-title="fullName"   
                      item-value="UserId"    
                      return-object
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn
                      icon
                      @click="removeMmembers(index)"
                    >
                      <VIcon
                        icon="tabler-minus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
                <!-- Button to add new chairperson -->
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      icon
                      @click="addMmembers"
                    >
                      <VIcon
                        icon="tabler-plus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>

                <VRow
                  v-for="(Fmember, index) in form.Fmembers"
                  :key="index"
                >
                  <VCol
                    cols="10"
                    md="4"
                  >
                    <VAutocomplete
                      v-model="form.Fmembers[index]"
                      :items="form.Femalemembers"
                      :label="`Female member ${index + 1}`"
                      variant="outlined"
                      item-title="fullName"   
                      item-value="UserId"    
                      return-object
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn
                      icon
                      @click="removeFmembers(index)"
                    >
                      <VIcon
                        icon="tabler-minus"
                        size="16"
                      />
                    </VBtn>
                  </VCol>
                </VRow>
                <!-- Button to add new chairperson -->
                <VRow>
                  <VCol cols="12">
                    <VBtn
                      icon
                      @click="addFmembers"
                    >
                      <VIcon
                        icon="tabler-plus"
                        size="16"
                      />
                    </VBtn>
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
