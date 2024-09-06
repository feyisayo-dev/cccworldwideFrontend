<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { useAllAdminActions } from '@/apiservices/adminActions'

import api from '@/apiservices/api'
import { onMounted, ref } from 'vue'
import { loadPaystackScript } from '@/apiservices/paystack'



const props = defineProps({
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
console.log("<=======This is the UserId=========>", userData.parishcode)
console.log("<=======This is the UserId=========>", userData.UserId)

const form = ref({
  ChruchName: userData.parishname || '',
  committeName: '',
  PaymentFor: '',
  committeRefno: '',
  committees: [],
  Amount: '',
  Paidfor: '',
  MemberName: '',
  members: [''],
})

const createApp = [
  {
    icon: 'tabler-clipboard',
    title: 'Member Payment Details',
    subtitle: 'Enter Details',
  },
]

const fetchMembersbyParish = message => {
  if (message) {
    try {
      api.get(`/Fetchmemberbyparish/${userData.parishcode}`)
        .then(response => {
          form.value.members = response.data.records.map(member => ({
            ...member,
            MemberName: `${member.fname} ${member.mname ? member.mname + ' ' : ''}${member.sname}`,
          }))
          console.log("This is the member", form.value.members)
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

const handlePaymentSuccess = async response => {
  try {
    let DBresponse

    if (form.value.PaymentFor === 'Committee') {
      const formDataCommittee = new FormData()

      formDataCommittee.append('committeName', form.value.committeName)
      formDataCommittee.append('parishcode', userData.parishcode)
      formDataCommittee.append('parishname', form.value.ChruchName)

      const MemberPaidFor = form.value.Paidfor === 'Myself' ? userData.UserId : form.value.MemberName

      formDataCommittee.append('paidfor', MemberPaidFor)
      formDataCommittee.append('paymentdate', new Date().toISOString())
      formDataCommittee.append('paidby', userData.UserId)
      formDataCommittee.append('amount', form.value.Amount)
      formDataCommittee.append('receipt', response.reference)
      formDataCommittee.append('roleName', form.value.roleName)
      formDataCommittee.append('committeRefno', form.value.committeRefno)

      DBresponse = await api.post('/addCommitteePayment', formDataCommittee, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else if (form.value.PaymentFor === 'Tithe') {
      const formDataTithe = new FormData()

      formDataTithe.append('parishcode', userData.parishcode)
      formDataTithe.append('parishname', form.value.ChruchName)

      const MemberPaidFor = form.value.Paidfor === 'Myself' ? userData.UserId : form.value.MemberName

      formDataTithe.append('paidfor', MemberPaidFor)
      formDataTithe.append('paymentdate', new Date().toISOString())
      formDataTithe.append('paidby', userData.UserId)
      formDataTithe.append('amount', form.value.Amount)
      formDataTithe.append('receipt', response.reference)

      DBresponse = await api.post('/AddNewTithe', formDataTithe, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else if (form.value.PaymentFor === 'Offering') {
      const formDataOffering = new FormData()

      formDataOffering.append('parishcode', userData.parishcode)
      formDataOffering.append('parishname', form.value.ChruchName)

      const MemberPaidFor = form.value.Paidfor === 'Myself' ? userData.UserId : form.value.MemberName

      formDataOffering.append('paidfor', MemberPaidFor)
      formDataOffering.append('paymentdate', new Date().toISOString())
      formDataOffering.append('paidby', userData.UserId)
      formDataOffering.append('amount', form.value.Amount)
      formDataOffering.append('receipt', response.reference)

      DBresponse = await api.post('/AddNewOffering', formDataOffering, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else if (form.value.PaymentFor === 'Building levy') {
      const formDataBuildingLevy = new FormData()

      formDataBuildingLevy.append('parishcode', userData.parishcode)
      formDataBuildingLevy.append('parishname', form.value.ChruchName)

      const MemberPaidFor = form.value.Paidfor === 'Myself' ? userData.UserId : form.value.MemberName

      formDataBuildingLevy.append('paidfor', MemberPaidFor)
      formDataBuildingLevy.append('paymentdate', new Date().toISOString())
      formDataBuildingLevy.append('paidby', userData.UserId)
      formDataBuildingLevy.append('amount', form.value.Amount)
      formDataBuildingLevy.append('receipt', response.reference)

      DBresponse = await api.post('/AddNewBuildingLevy', formDataBuildingLevy, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    } else if (form.value.PaymentFor === 'Baptism') {
      const formDataBaptism = new FormData()

      formDataBaptism.append('parishcode', userData.parishcode)
      formDataBaptism.append('parishname', form.value.ChruchName)

      const MemberPaidFor = form.value.Paidfor === 'Myself' ? userData.UserId : form.value.MemberName

      formDataBaptism.append('paidfor', MemberPaidFor)
      formDataBaptism.append('paymentdate', new Date().toISOString())
      formDataBaptism.append('paidby', userData.UserId)
      formDataBaptism.append('amount', form.value.Amount)
      formDataBaptism.append('receipt', response.reference)

      DBresponse = await api.post('/AddNewBaptismPayment', formDataBaptism, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    }

    console.log('Backend response:', DBresponse)

    const apiResponseDetails = DBresponse.data

    apiResponseStatus.value = apiResponseDetails.status
    apiResponseMessage.value = apiResponseDetails.message

    if (apiResponseStatus.value === 200) {
      emit('changes')
    }
  } catch (error) {
    console.error('Error while handling payment success:', error)
  }
}


const onSubmit = async () => {
  try {
    const paystackLoaded = await loadPaystackScript() // Load Paystack
    if (!paystackLoaded) {
      alert('Paystack SDK failed to load. Please check your connection.')
      
      return
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_test_2f2b757d9fa8eb59d1597d48e0c6d16fe648d7b9', // Paystack public key
      email: userData.email, // replace with the user's email
      amount: form.value.Amount * 100, // in kobo
      currency: 'NGN',
      callback: response => {
        alert('Payment successful! Reference: ' + response.reference)
        handlePaymentSuccess(response)
      },
      onClose: () => {
        alert('Transaction was not completed.')
      },
    })

    handler.openIframe()
  } catch (error) {
    console.error('Error with payment submission:', error)
  }
}

const isConfirmDialogVisible = ref(false)

watch(() => form.value.committeName, newValue => {
  const selectedCommittee = form.value.committees.find(
    committee => committee.committeName === newValue,
  )

  // Debugging logs
  console.log("Committees:", form.value.committees)
  console.log("Selected Committee:", selectedCommittee)
  console.log("Committee Name in form:", form.value.committeName)
  console.log("New Value:", newValue)

  if (selectedCommittee) {
    form.value.committeRefno = selectedCommittee.committeRefno
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
          Member Payment
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form
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
                    md="12"
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
                      v-model="form.PaymentFor"
                      :items="['Committee', 'Tithe', 'Offering', 'Building levy', 'Baptism']"
                      label="Payment For"
                      variant="outlined"
                      placeholder=" Select what payment is for "
                    />
                  </VCol>
                  <VCol
                    v-if="form.PaymentFor == 'Committee'"
                    cols="12"
                    md="6"
                  >
                    <VAutocomplete
                      v-model="form.committeName"
                      :items="form.committees"
                      label="Committee Name"
                      variant="outlined"
                      item-title="committeName"   
                      item-value="committeName"
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <AppTextField
                      v-model="form.Amount"
                      label="Amount to be paid"
                      variant="outlined"
                      placeholder=" #50,000 "
                    />
                  </VCol>
                  <VCol
                    v-if="form.PaymentFor == 'Committee'"
                    cols="12"
                    md="6"
                  >
                    <AppSelect
                      v-model="form.roleName"
                      :items="['Chairman', 'Chairperson', 'Secetary', 'Member', 'Treasurer', 'Fin Sec']"
                      label="Your role in committee"
                      variant="outlined"
                      placeholder=" Chairman/Secetary/Member "
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol
                    cols="12"
                    md="6"
                  >
                    <AppSelect
                      v-model="form.Paidfor"
                      :items="['Myself', 'Another Member']"
                      variant="outlined"
                      label="Select who you are paying for"
                    />
                  </VCol>
                  <VCol
                    v-if="form.Paidfor == 'Another Member'"
                    cols="12"
                    md="6"
                  >
                    <VAutocomplete
                      v-model="form.MemberName"
                      :items="form.members"
                      label="Paid For"
                      variant="outlined"
                      item-title="MemberName"
                      item-value="MemberName"
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
    confirmation-question="You are about to confirm this committee &#10; Do you want to continue ?"
    cancel-msg="Registration Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Successful!"
    @confirm="onSubmit"
    @cancel="onCancel"
  />
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 24px;
}
</style>
