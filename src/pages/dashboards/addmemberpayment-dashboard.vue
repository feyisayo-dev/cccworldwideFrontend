<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const isConfirmDialogVisible = ref(false)
const AllAdminActions = useAllAdminActions()
const searchQuery = ref('')
const totalPage = ref(1)
const MemberPayment = ref([])
const CommitteeMemberId = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const isCreateMemberPaymentVisible = ref(false)
const isEditMemberPaymentVisible = ref(false)
const isViewMemberPaymentVisible = ref(false)
let MemberPaymentData = ref([])
const userData = JSON.parse(localStorage.getItem('userData') || 'null')

const onCancel = () => {
  console.log('Cancel clicked')
}

const openEditMemberPaymentDialog = MemberPayment => {
  MemberPaymentData.value =  MemberPayment.raw
  isEditMemberPaymentVisible.value = true
}

const openMemberPaymentDialog = MemberPayment => {
  MemberPaymentData.value =  MemberPayment.raw
  isViewMemberPaymentVisible.value = true
}


const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})


const headers = [
  {
    title: 'Payment for',
    key: 'paymentFor',
  },
  {
    title: 'Paid for',
    key: 'paidFor',
  },
  {
    title: 'Payment by',
    key: 'paidBy',
  },
  {
    title: 'Amount Paid',
    key: 'amount',
  },
  {
    title: 'Date Paid',
    key: 'datePaid',
  },
  {
    title: 'Role',
    key: 'role',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

let totalCommitteeMembers = 0

const fetchAllPayments = async () => {
  try {
    const response = await api.get(`/getMemberPayment/${userData.UserId}`)

    MemberPayment.value = response.data.map(payment => ({
      paymentFor: payment.payment_type,
      paidFor: payment.paidfor,
      paidBy: payment.paidby,
      amount: payment.amount,
      datePaid: payment.payment_date,
      role: payment.roleName ? payment.roleName : 'Member', 
    }))
    console.log("Member Payment Data:", MemberPayment.value)
  } catch (error) {
    console.error('Error:', error)
  }
}



watchEffect(fetchAllPayments)

const changes = () => {
  fetchAllPayments()
  isCreateMemberPaymentVisible.value = false
  isEditMemberPaymentVisible.value = false 
}

const deleteCommiteeMembers = id => {

  isConfirmDialogVisible.value= true

  CommitteeMemberId.value=id
}

const onDeleteCommiteeMembers = () => {
  if (CommitteeMemberId.value) {
    try {
      api.delete(`/deleteCommitteeMember/${CommitteeMemberId.value}/delete`)
        .then(response => {
          const apiResponseDetails = response.data

          apiResponseStatus.value = apiResponseDetails.status
          apiResponseMessage.value = apiResponseDetails.message

          fetchAllPayments()
        })
        .catch(error => {
          console.error('Error deleting item:', error)
        })
        .finally(() => {
          isConfirmDialogVisible.value = false
          CommitteeMemberId.value = null
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard title="Search Filter">
          <VDivider />

          <VCardText class="d-flex flex-wrap py-4 gap-4">
            <div class="me-3 d-flex gap-3">
              <AppSelect
                :model-value="options.itemsPerPage"
                :items="[
                  { value: 10, title: '10' },
                  { value: 25, title: '25' },
                  { value: 50, title: '50' },
                  { value: 100, title: '100' },
                  { value: -1, title: 'All' },
                ]"
                style="width: 6.25rem;"
                @update:model-value="options.itemsPerPage = parseInt($event, 10)"
              />
            </div>
            <VSpacer />

            <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
              <!-- 👉 Search  -->
              <div style="inline-size: 10rem;">
                <AppTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>

              <!-- 👉 Export button -->
              <!-- 
                <VBtn
                variant="tonal"
                color="secondary"
                prepend-icon="tabler-screen-share"
                >
                Export
                </VBtn>

                <VBtn>
              -->
              <!-- 👉 Add MemberPayment button -->

              <VBtn
                prepend-icon="tabler-plus"
                @click="isCreateMemberPaymentVisible = !isCreateMemberPaymentVisible"
              >
                Add Committee Members Payment
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
         
          <!-- SECTION datatable <pre>{{ MemberPayment }}</pre> -->
          <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="MemberPayment"
            :items-length="totalCommitteeMembers"
            :headers="headers"
            class="text-no-wrap"
            @update:options="options = $event"
          >
            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="deleteCommiteeMembers(item.raw.committeRefno)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <VBtn
                icon
                size="small"
                color="medium-emphasis"
                variant="text"
                @click="openEditMemberPaymentDialog(item)"
              >
                <VIcon
                  size="22"
                  icon="tabler-edit"
                />
              </VBtn>

              <VBtn
                icon
                size="small"
                color="medium-emphasis"
                variant="text"
                @click="openMemberPaymentDialog(item)"
              >
                <VIcon
                  size="22"
                  icon="tabler-eye"
                />
              </VBtn>

              <VBtn
                icon
                variant="text"
                size="small"
                color="medium-emphasis"
              />
            </template>

            <!-- pagination -->
            <template #bottom>
              <VDivider />
              <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
                <p class="text-sm text-disabled mb-0">
                  {{ paginationMeta(options, totalCommitteeMembers) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalCommitteeMembers / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalCommitteeMembers / options.itemsPerPage)"
                >
                  <template #prev="slotProps">
                    <VBtn
                      variant="tonal"
                      color="default"
                      v-bind="slotProps"
                      :icon="false"
                    >
                      Previous
                    </VBtn>
                  </template>

                  <template #next="slotProps">
                    <VBtn
                      variant="tonal"
                      color="default"
                      v-bind="slotProps"
                      :icon="false"
                    >
                      Next
                    </VBtn>
                  </template>
                </VPagination>
              </div>
            </template>
          </VDataTableServer>
          <!-- SECTION -->
        </VCard>

        <!-- 👉 Create MemberPayment dialog -->
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateMemberPaymentDialog
            v-model:is-dialog-visible="isCreateMemberPaymentVisible" 
            @changes="changes"
          />
        </VCol>
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <ViewCommitteeMemberDialog
            v-model:is-dialog-visible="isViewMemberPaymentVisible"
            :committee-member-data="MemberPaymentData"
          />
        </VCol>
      </VCol>
    </VRow>
  </section>

  <!-- 👉 Confirm delete title Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to delete this Committee Members  Do you want to continue ?"
    cancel-msg="Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Deleted!"
    @confirm="onDeleteCommiteeMembers"
    @cancel="onCancel"
  />
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
</style>
