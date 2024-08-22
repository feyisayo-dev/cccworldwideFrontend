<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const isConfirmDialogVisible = ref(false)
const AllAdminActions = useAllAdminActions()
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const totalPage = ref(1)
const totalMinistry = ref(0)
const ministry = ref([])
const ministryId = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)
const permissionName = ref('')
const isCreateMinistryVisible = ref(false)
const isEditMinistryVisible = ref(false)
let ministryData = ref([])

const openEditMinistryDialog = ministry => {
  // Set the clicked ministry data to a variable accessible by the Dialog component
  ministryData.value =  ministry.raw
  isEditMinistryVisible.value = true
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
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Ministry',
    key: 'ministry',
  },

  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

// 👉 Fetching ministry
const fetchAllMinistry = () => {
  AllAdminActions.fetchMinistryFromApi({
  }).then(response => {
    ministry.value = response.data.ministry
 
    console.log("this is the title value", ministry.value)
  }).catch(error => {
    console.error(error)
  })
}

watchEffect(fetchAllMinistry)


const deleteMinistry = id => {

  isConfirmDialogVisible.value= true

  ministryId.value=id
}

const onDeleteMinistry = message => {

  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (message) {
    //if true


    if (ministryId.value) {
      try {
        // API call to delete the item
        api.delete(`/DeleteMinistry/${ministryId.value}/delete`)
          .then(response => {

        

            const apiResponseDetails = response.data

            apiResponseStatus.value = apiResponseDetails.status
            apiResponseMessage.value = apiResponseDetails.message

            fetchAllMinistry()

            // // Handle additional logic after deletion if needed
            // console.log('Deleted title  with ID:', ministryId.value)
          })
          .catch(error => {
            console.error('Error deleting item:', error)
          })
          .finally(() => {
            isConfirmDialogVisible.value = false
            ministryId.value = null // Reset title item ID
          })
      } catch (error) {
        console.error('Error:', error)
      }
   
 
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
              <!-- 👉 Add ministry button -->

              <VBtn
                prepend-icon="tabler-plus"
                @click="isCreateMinistryVisible = !isCreateMinistryVisible"
              >
                Add ministry
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
         
          <!-- SECTION datatable <pre>{{ ministry }}</pre> -->
          <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="ministry"
            :items-length="totalMinistry"
            :headers="headers"
            class="text-no-wrap"
            @update:options="options = $event"
          >
            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="deleteMinistry(item.raw.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <VBtn
                icon
                size="small"
                color="medium-emphasis"
                variant="text"
                @click="openEditMinistryDialog(item)"
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
                  {{ paginationMeta(options, totalMinistry) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalMinistry / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalMinistry / options.itemsPerPage)"
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

        <!-- 👉 Create ministry dialog -->
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateMinistryDialog v-model:is-dialog-visible="isCreateMinistryVisible" />
        </VCol>
        <!-- 👉 Edit ministry dialog -->
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <EditMinistryDialog
            v-model:is-dialog-visible="isEditMinistryVisible"
            :ministry-data="ministryData"
          />
        </VCol>
      </vcol>
    </vrow>
  </section>

  <!-- 👉 Confirm delete title Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to delete this title  Did you want to continue ?"
    cancel-msg="Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Deleted!"
    @confirm="onDeleteMinistry"
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
