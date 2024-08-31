<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const isConfirmDialogVisible = ref(false)
const AllAdminActions = useAllAdminActions()
const searchQuery = ref('')
const totalPage = ref(1)
const totalCommitteeMembers = ref(0)
const CommitteeMember = ref([])
const CommitteeMemberId = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const isCreateCommitteeMemberVisible = ref(false)
const isEditCommitteeMemberVisible = ref(false)
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
  isEditCommitteeMemberVisible.value = true
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

const fetchAllMCommitteeMember = () => {
  AllAdminActions.fetchAllCommitteeMember({})
    .then(response => {
      CommitteeMember.value = response.data.committeeMembers
      totalCommitteeMembers = CommitteeMember.length

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
            role: `Mmember ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.MmembersList.length
        }

        // Process the Fmembers position
        if (member.Fmembers) {
          member.FmembersList = member.Fmembers.split(',').map((name, index) => ({
            role: `Fmember ${index + 1}`,
            name: name.trim(),
          }))
          totalMembers += member.FmembersList.length
        }

        // Add the total member count to the member object
        member.totalMembers = totalMembers
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
      <!--
        <VCol
        v-for="meta in userListMeta"
        :key="meta.title"
        cols="12"
        sm="6"
        lg="3"
        >
    
        <VCard>
        <VCardText class="d-flex justify-space-between">
        <div>
        <span>{{ meta.title }}</span>
        <div class="d-flex align-center gap-2 my-1">
        <h6 class="text-h4">
        {{ meta.stats }}
        </h6>
        <span :class="meta.percentage > 0 ? 'text-success' : 'text-error'">( {{ meta.percentage > 0 ? '+' : '' }} {{ meta.percentage }}%)</span>
        </div>
        <span>{{ meta.subtitle }}</span>
        </div>

        <VAvatar
        rounded
        variant="tonal"
        :color="meta.color"
        :icon="meta.icon"
        />
        </VCardText>
        </VCard>
     
        </VCol>
      -->
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
              <IconBtn @click="deleteCommiteeMembers(item.raw.id)">
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
            @changes="changes"
          />
        </VCol>
        <!-- 👉 Edit CommitteeMember dialog -->
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <EditMinistryDialog
            v-model:is-dialog-visible="isEditCommitteeMemberVisible"
            :committee-member-data="committeeMemberData"
          />
        </VCol>
      </vcol>
    </vrow>
  </section>

  <!-- 👉 Confirm delete title Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to delete this Committee Members  Did you want to continue ?"
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
