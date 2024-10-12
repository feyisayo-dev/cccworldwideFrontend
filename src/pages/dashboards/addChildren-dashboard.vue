<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const isConfirmDialogVisible = ref(false)
const AllAdminActions = useAllAdminActions()
const searchQuery = ref('')
const totalPage = ref(1)
const FamilyMembers = ref([])
const CommitteeMemberId = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const isMemberChildrenVisible = ref(false)
const isEditMemberChildrenVisible = ref(false)
const isViewMemberFamilyVisible = ref(false)
let MemberChildrenData = ref([])

const onCancel = () => {
  console.log('Cancel clicked')
}

const openEditMemberChildrenDialog = FamilyMembers => {
  MemberChildrenData.value =  FamilyMembers.raw
  isEditMemberChildrenVisible.value = true
}

const openMemberFamilyDialog = FamilyMembers => {
  MemberChildrenData.value =  FamilyMembers.raw
  isViewMemberFamilyVisible.value = true
}
const userData = JSON.parse(localStorage.getItem('userData') || 'null')


const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})


// Table Headers
const headers = [
  {
    title: 'Child Name',
    key: 'fullname',
  },
  {
    title: 'Age',
    key: 'age',
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

let totalFamilyMembers = 0

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  // If the birth date hasn't occurred yet this year, subtract 1 from age
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const fetchAllChildren = (message) => {
  if (message) {
    try {
      api.get(`/children/${userData.UserId}/viewallchildren`)
        .then(response => {
          FamilyMembers.value = response.data.children.map(child => ({
            ...child,
            fullname: `${child.fname} ${child.mname} ${child.sname}`,  // Construct fullname
            age: calculateAge(child.dob)  // Calculate age based on DOB
          }));
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  }
};


watchEffect(fetchAllChildren)

const changes = () => {
  fetchAllChildren()
  isMemberChildrenVisible.value = false
  isEditMemberChildrenVisible.value = false 
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

          fetchAllChildren()
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

              <VBtn
                prepend-icon="tabler-plus"
                @click="isMemberChildrenVisible = !isMemberChildrenVisible"
              >
                Add Members Children
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
         
          <!-- SECTION datatable <pre>{{ FamilyMembers }}</pre> -->
          <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="FamilyMembers"
            :items-length="totalFamilyMembers"
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
                @click="openEditMemberChildrenDialog(item)"
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
                @click="openMemberFamilyDialog(item)"
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
                  {{ paginationMeta(options, totalFamilyMembers) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalFamilyMembers / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalFamilyMembers / options.itemsPerPage)"
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

        <!-- 👉 Create FamilyMembers dialog -->
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateChildrenDialog
            v-model:is-dialog-visible="isMemberChildrenVisible" 
            :family-member-data="MemberChildrenData"
            @changes="changes"
          />
        </VCol>
        <!-- 👉 Edit FamilyMembers dialog -->
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <CreateCommitteeMemberDialog
            v-model:is-dialog-visible="isEditMemberChildrenVisible"
            :family-member-data="MemberChildrenData"
            @changes="changes"
          />
        </VCol>

        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <ViewCommitteeMemberDialog
            v-model:is-dialog-visible="isViewMemberFamilyVisible"
            :family-member-data="MemberChildrenData"
          />
        </VCol>
      </VCol>
    </VRow>
  </section>

  <!-- 👉 Confirm delete title Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to delete this Family Members  Do you want to continue ?"
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
