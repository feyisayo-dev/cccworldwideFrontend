<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const isConfirmDialogVisible = ref(false)
const AllAdminActions = useAllAdminActions()
const searchQuery = ref('')
const totalPage = ref(1)
const CommitteeMember = ref([])
const CommitteeMemberId = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const isCreateCommitteeMemberVisible = ref(false)
const isEditCommitteeMemberVisible = ref(false)
const isViewCommitteeMemberVisible = ref(false)
let committeeMemberData = ref([])

const onCancel = () => {
  console.log('Cancel clicked')
}

const openEditCommitteeMemberDialog = CommitteeMember => {
  committeeMemberData.value =  CommitteeMember.raw
  isEditCommitteeMemberVisible.value = true
}

const openCommitteeMemberDialog = CommitteeMember => {
  committeeMemberData.value =  CommitteeMember.raw
  isViewCommitteeMemberVisible.value = true
}


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
    title: 'Committee name',
    key: 'committeName',
  },
  {
    title: 'Member Count',
    key: 'totalMembers',
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

let totalCommitteeMembers = 0

const fetchAllMCommitteeMember = () => {
  AllAdminActions.fetchAllCommitteeMember({})
    .then(response => {
      CommitteeMember.value = response.data.committeeMembers
      totalCommitteeMembers = CommitteeMember.value.length

      CommitteeMember.value.forEach(member => {
        let totalMembers = 0

        // Process the Chairman position
        if (member.chairman) {
          member.chairmen = member.chairman.split(',').map((name, index) => ({
            role: `Chairman ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.chairmen.length
        }

        // Process the Chairperson position
        if (member.chairperson) {
          member.chairpersons = member.chairperson.split(',').map((name, index) => ({
            role: `Chairperson ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.chairpersons.length
        }

        // Process the Secretary position
        if (member.secretary) {
          member.secretaries = member.secretary.split(',').map((name, index) => ({
            role: `Secretary ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.secretaries.length
        }

        if (member.Fsecretary) {
          member.Fsecretaries = member.Fsecretary.split(',').map((name, index) => ({
            role: `Financial secretary ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.Fsecretaries.length
        }

        // Process the Treasurer position
        if (member.treasurer) {
          member.treasurers = member.treasurer.split(',').map((name, index) => ({
            role: `Treasurer ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.treasurers.length
        }

        // Process the Mmembers position
        if (member.Mmembers) {
          member.MmembersList = member.Mmembers.split(',').map((name, index) => ({
            role: `Male member ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.MmembersList.length
        }

        // Process the Fmembers position
        if (member.Fmembers) {
          member.FmembersList = member.Fmembers.split(',').map((name, index) => ({
            role: `Female member ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.FmembersList.length
        }

        // Add the total member count to the member object
        member.totalMembers = totalMembers
        console.log(totalMembers)
      })

      console.log("this is the committee members value", CommitteeMember.value)
    })
    .catch(error => {
      console.error(error)
    })
}


watchEffect(fetchAllMCommitteeMember)

const changes = () => {
  fetchAllMCommitteeMember()
  isCreateCommitteeMemberVisible.value = false
  isEditCommitteeMemberVisible.value = false 
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

          fetchAllMCommitteeMember()
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
              <!-- 👉 Add CommitteeMember button -->

              <VBtn
                prepend-icon="tabler-plus"
                @click="isCreateCommitteeMemberVisible = !isCreateCommitteeMemberVisible"
              >
                Add Committee Members
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
         
          <!-- SECTION datatable <pre>{{ CommitteeMember }}</pre> -->
          <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="CommitteeMember"
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
                @click="openEditCommitteeMemberDialog(item)"
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
                @click="openCommitteeMemberDialog(item)"
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

        <!-- 👉 Create CommitteeMember dialog -->
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateCommitteeMemberDialog
            v-model:is-dialog-visible="isCreateCommitteeMemberVisible" 
            :committee-member-data="committeeMemberData"
            @changes="changes"
          />
        </VCol>
        <!-- 👉 Edit CommitteeMember dialog -->
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <CreateCommitteeMemberDialog
            v-model:is-dialog-visible="isEditCommitteeMemberVisible"
            :committee-member-data="committeeMemberData"
            @changes="changes"
          />
        </VCol>

        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <ViewCommitteeMemberDialog
            v-model:is-dialog-visible="isViewCommitteeMemberVisible"
            :committee-member-data="committeeMemberData"
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
