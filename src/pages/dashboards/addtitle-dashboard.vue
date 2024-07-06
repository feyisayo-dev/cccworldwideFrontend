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
const totalTitle = ref(0)
const titleName = ref([])
const titleId = ref(0)
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)
const permissionName = ref('')
const isCreateTitleVisible = ref(false)
const isEditTitleVisible = ref(false)
let TitleData = ref([])

const openEditTitleDialog = Title => {
  // Set the clicked Title data to a variable accessible by the EditTitleDialog component
  TitleData.value =  Title.raw
  isEditTitleVisible.value = true
}



const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})



// Retrieve stored data from local storage on component mount
// const storedData = JSON.parse(localStorage.getItem('tableData') || '[]')

// users.value = storedData

// Function to filter users based on search query
const filteredUsers = computed(() => {
  return users.value.filter(user => {

    const fullNameMatch = user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Add additional keys for filtering
    const emailMatch = user.email.toLowerCase().includes(searchQuery.value.toLowerCase())


    const genderMatch = user.gender.toLowerCase() === searchQuery.value.toLowerCase()

    const roleMatch = user.role.toLowerCase() === searchQuery.value.toLowerCase()


    // Combine the results using logical OR (||) for flexibility
    return fullNameMatch || emailMatch || genderMatch || roleMatch

    // Add more conditions with logical OR (||) as needed
  })
})




// Table Headers
const headers = [
  {
    title: 'Gender',
    key: 'gender',
  },
  {
    title: 'Title Name',
    key: 'title',
  },
  {
    title: 'Status',
    key: 'status',
  },

  {
    title: 'Amount',
    key: 'amount',
  },

  {
    title: 'Level',
    key: 'level',
  },

  // {
  //   title: 'created at',
  //   key: 'created_at',
  // },

  // {
  //   title: 'updated at',
  //   key: 'updated_at',
  // },

  // {
  //   title: 'email',
  //   value: 'email',
  // },
  
  // {
  //   title: 'Category',
  //   key: 'category',
  // },

 


  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

// 👉 Fetching Title
const fetchAllTitle = () => {
  AllAdminActions.fetchAlltitle({
    q: searchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    options: options.value,
  }).then(response => {
    // Title.value = response.data.allTitle
 
    const processedTitles = response.data.titles.map(title => {
      const sum = (parseInt(title.p1) || 0) + (parseInt(title.p2) || 0) + (parseInt(title.p3) || 0) + (parseInt(title.p4) || 0) + (parseInt(title.p5) || 0) + (parseInt(title.p6) || 0) + (parseInt(title.p7) || 0) + (parseInt(title.p8) || 0) + (parseInt(title.p9) || 0)

      return { ...title, amount: sum }
    })

    titleName.value = processedTitles


    // totalPage.value = response.data.totalPage
    // totalTitle.value = response.data.totalTitle
    // options.value.page = response.data.page
    console.log("this is the title value", processedTitles)
  }).catch(error => {
    console.error(error)
  })
}

watchEffect(fetchAllTitle)

// 👉 search filters
const roles = [
  {
    title: 'Admin',
    value: 'admin',
  },
  {
    title: 'Client',
    value: 'client',
  },
]

const plans = [
  {
    title: 'Basic',
    value: 'basic',
  },
  {
    title: 'Company',
    value: 'company',
  },
  {
    title: 'Enterprise',
    value: 'enterprise',
  },
  {
    title: 'Team',
    value: 'team',
  },
]

const status = [
  {
    title: 'Pending',
    value: 'pending',
  },
  {
    title: 'Active',
    value: 'active',
  },
  {
    title: 'Inactive',
    value: 'inactive',
  },
]

const resolveUserRoleVariant = category => {
  const roleLowerCase = category.toLowerCase()
  if (roleLowerCase === 'national')
    return {
      color: 'warning',
      icon: 'custom-home',
    }
  if (roleLowerCase === 'state')
    return {
      color: 'success',
      icon: 'custom-home',
    }
  if (roleLowerCase === 'area')
    return {
      color: 'primary',
      icon: 'custom-home',
    }
  if (roleLowerCase === 'province')
    return {
      color: 'info',
      icon: 'custom-home',
    }
  if (roleLowerCase === 'circuit')
    return {
      color: 'secondary',
      icon: 'custom-home',
    }

  if (roleLowerCase === 'district')
    return {
      color: 'secondary',
      icon: 'custom-home',
    }
  
  return {
    color: 'primary',
    icon: 'custom-home',
  }
}

const resolveUserStatusVariant = stat => {
  const statLowerCase = stat.toLowerCase()
  if (statLowerCase === 'pending')
    return 'warning'
  if (statLowerCase === 'active')
    return 'success'
  if (statLowerCase === 'inactive')
    return 'secondary'
  
  return 'primary'
}

const isAddNewUserDrawerVisible = ref(false)

// 👉 List
const userListMeta = [
  {
    icon: 'tabler-user',
    color: 'primary',
    title: 'Session',
    stats: '21,459',
    percentage: +29,
    subtitle: 'Total Users',
  },
  {
    icon: 'tabler-user-plus',
    color: 'error',
    title: 'Paid Users',
    stats: '4,567',
    percentage: +18,
    subtitle: 'Last week analytics',
  },
  {
    icon: 'tabler-user-check',
    color: 'success',
    title: 'Active Users',
    stats: '19,860',
    percentage: -14,
    subtitle: 'Last week analytics',
  },
  {
    icon: 'tabler-user-exclamation',
    color: 'warning',
    title: 'Pending Users',
    stats: '237',
    percentage: +42,
    subtitle: 'Last week analytics',
  },
]

const deleteTitle = id => {

  isConfirmDialogVisible.value= true

  titleId.value=id
}

const editPermission = name => {
  isPermissionDialogVisible.value = true
  permissionName.value = name
}

const onDeleteTitle = message => {

  // eslint-disable-next-line sonarjs/no-collapsible-if
  if (message) {
    //if true


    if (titleId.value) {
      try {
        // API call to delete the item
        api.delete(`/title/${titleId.value}/delete`)
          .then(response => {

        

            const apiResponseDetails = response.data

            apiResponseStatus.value = apiResponseDetails.status
            apiResponseMessage.value = apiResponseDetails.message

            fetchAllTitle()

            // // Handle additional logic after deletion if needed
            // console.log('Deleted title  with ID:', titleId.value)
          })
          .catch(error => {
            console.error('Error deleting item:', error)
          })
          .finally(() => {
            isConfirmDialogVisible.value = false
            titleId.value = null // Reset title item ID
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
              <!-- 👉 Add Title button -->

              <VBtn
                prepend-icon="tabler-plus"
                @click="isCreateTitleVisible = !isCreateTitleVisible"
              >
                Add Title
              </VBtn>
            </div>
          </VCardText>

          <VDivider />
         
          <!-- SECTION datatable <pre>{{ titleName }}</pre> -->
          <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="titleName"
            :items-length="totalTitle"
            :headers="headers"
            class="text-no-wrap"
            @update:options="options = $event"
          >
            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="deleteTitle(item.raw.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <VBtn
                icon
                size="small"
                color="medium-emphasis"
                variant="text"
                @click="openEditTitleDialog(item)"
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
                  {{ paginationMeta(options, totalTitle) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalTitle / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalTitle / options.itemsPerPage)"
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

        <!-- 👉 Create Title dialog -->
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateTitleDialog v-model:is-dialog-visible="isCreateTitleVisible" />
        </VCol>

        <!-- 👉 Edit Title dialog -->
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <EditTitleDialog
            v-model:is-dialog-visible="isEditTitleVisible"
            :title-data="TitleData"
          />
        </VCol>
      </vcol>
    </vrow>
  </section>

  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to delete this title  Did you want to continue ?"
    cancel-msg="Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Deleted!"
    @confirm="onDeleteTitle"
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
