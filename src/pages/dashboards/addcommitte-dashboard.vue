<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import api from '@/apiservices/api'

const AllAdminActions = useAllAdminActions()
const searchQuery = ref('')
const totalPage = ref(1)
const totalCommittee = ref(0)
const committee = ref([])
const isConfirmDialogVisible = ref(false)

const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)
const permissionName = ref('')
const isCreateCommitteeVisible = ref(false)
const isEditCommitteeVisible = ref(false)
let committeeData = ref(null)
let CommitteeId = ref(null)

const apiResponseStatus = ref('')
const apiResponseMessage = ref('')

const openEditCommitteeDialog = committee => {
  // Set the clicked committee data to a variable accessible by the EditParishDialog component
  committeeData.value =  committee.raw
  console.log("<===This is the committee data===>", committeeData.value)

  // Open the edit dialog
  isEditCommitteeVisible.value = true
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
    title: 'Committee Name',
    key: 'committeName',
  },
  {
    title: 'Parish Name',
    key: 'parishname',
  },
  {
    title: 'From',
    key: 'from',
  },
  {
    title: 'To',
    key: 'to',
  },

  {
    title: 'created at',
    key: 'created_at',
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

const fetchAllCommittee = () => {
  AllAdminActions.fetchAllcommittee({
  }).then(response => {
    committee.value = response.data.Allcommittee
    console.log("<===This is the committee===>", committee.value)
    totalPage.value = response.data.totalPage
    totalCommittee.value = response.data.totalCommittee
    options.value.page = response.data.page
    console.log("this is the title value", response.data.Allcommittee)

  }).catch(error => {
    console.error(error)
  })
}

const changes = () => {
  fetchAllCommittee()
  isEditCommitteeVisible.value = false
}

watchEffect(fetchAllCommittee)

const onDeleteCommittee = () => {
  const id = CommitteeId.value

  try{
    //called the endpoint to add committee
    api.delete(`/deleteCommittee/${id}/delete`, {
    }).then(response => {

      const apiResponseDetails=response.data

      console.log('request==> ', JSON.stringify(response.data))

      apiResponseStatus.value=apiResponseDetails.status
      apiResponseMessage.value=apiResponseDetails.message
    }).catch(e => {
      console.log(e)
    })
      .finally(() => {
        isConfirmDialogVisible.value = false
        changes()
      })
  }  catch (error) {
    console.error('Error:', error)
  }
  fetchAllCommittee()
}

const deleteCommittee = id => {
  isConfirmDialogVisible.value= true
  CommitteeId.value = id
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
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Select Role -->
              <!--
                <VCol
                cols="12"
                sm="4"
                >
                <AppSelect
                v-model="selectedRole"
                label="Select Role"
                :items="roles"
                clearable
                clear-icon="tabler-x"
                />
                </VCol>
              -->
              <!-- 👉 Select Plan -->
              <!-- 
                <VCol
                cols="12"
                sm="4"
                >
                <AppSelect
                v-model="selectedPlan"
                label="Select Plan"
                :items="plans"
                clearable
                clear-icon="tabler-x"
                />
                </VCol>
              -->
              <!-- 👉 Select Status -->
              <!--
                <VCol
                cols="12"
                sm="4"
                >
                <AppSelect
                v-model="selectedStatus"
                label="Select Status"
                :items="status"
                clearable
                clear-icon="tabler-x"
                />
                </VCol>
              -->
            </VRow>
          </VCardText>

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
              <!-- 👉 Add committee button -->

              <VBtn
                prepend-icon="tabler-plus"
                @click="isCreateCommitteeVisible = !isCreateCommitteeVisible"
              >
                Add Committee
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
         
          <!-- SECTION datatable <pre>{{ committee }}</pre> -->
          <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="committee"
            :items-length="totalCommittee"
            :headers="headers"
            class="text-no-wrap"
            @update:options="options = $event"
          >
            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="deleteCommittee(item.raw.committeRefno)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <VBtn
                icon
                size="small"
                color="medium-emphasis"
                variant="text"
                @click="openEditCommitteeDialog(item)"
              >
                <VIcon
                  size="22"
                  icon="tabler-edit"
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
                  {{ paginationMeta(options, totalCommittee) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalCommittee / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalCommittee / options.itemsPerPage)"
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
        <!-- 👉 Add New User Permission -->
        <AddEditPermissionDialog
          v-model:isDialogVisible="isPermissionDialogVisible"
          v-model:permission-name="permissionName"
        />
        <AddEditPermissionDialog v-model:isDialogVisible="isAddPermissionDialogVisible" />

        <!-- 👉 Create committee dialog -->
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateCommitteeDialog v-model:is-dialog-visible="isCreateCommitteeVisible" />
        </VCol>

        <!-- 👉 Edit committee dialog -->
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <EditCommitteeDialogue
            v-model:is-dialog-visible="isEditCommitteeVisible"
            :committee-data="committeeData"
            @changes="changes"
          />
          <ConfirmDialog
            v-model:isDialogVisible="isConfirmDialogVisible"
            :api-response="apiResponseStatus"
            confirmation-question="You are about to delete this committee Did you want to continue ?"
            cancel-msg="Delete Cancelled!!"
            cancel-title="Cancelled"
            :confirm-msg="apiResponseMessage"
            confirm-title="Delete Successfully!"
            @confirm="onDeleteCommittee"
            @cancel="onCancel"
          />
        </VCol>
      </vcol>
    </vrow>
  </section>
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
