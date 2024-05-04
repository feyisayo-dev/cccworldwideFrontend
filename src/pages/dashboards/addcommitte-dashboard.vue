<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

const AllAdminActions = useAllAdminActions()
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const totalPage = ref(1)
const totalParish = ref(0)
const committee = ref([])

const isPermissionDialogVisible = ref(false)
const isAddPermissionDialogVisible = ref(false)
const permissionName = ref('')
const isCreateCommitteeVisible = ref(false)
const isEditParishVisible = ref(false)
let parishData = ref([])

const openEditParishDialog = parish => {
  // Set the clicked parish data to a variable accessible by the EditParishDialog component
  parishData.value =  parish.raw

  // Open the edit dialog
  isEditParishVisible.value = true
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

// 👉 Fetching Parish
const fetchAllCommittee = () => {
  AllAdminActions.fetchAllcommittee({
    q: searchQuery.value,
    status: selectedStatus.value,
    plan: selectedPlan.value,
    role: selectedRole.value,
    options: options.value,
  }).then(response => {
    // parish.value = response.data.allParish
    committee.value = response.data.Allcommittee
    totalPage.value = response.data.totalPage
    totalParish.value = response.data.totalParish
    options.value.page = response.data.page
  }).catch(error => {
    console.error(error)
  })
}

watchEffect(fetchAllCommittee)

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

const deleteUser = id => {
  AllAdminActions.deleteUser(id)

  // refetch User
  fetchAllCommittee()
}

const editPermission = name => {
  isPermissionDialogVisible.value = true
  permissionName.value = name
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
              <!-- 👉 Add parish button -->

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
            :items-length="totalParish"
            :headers="headers"
            class="text-no-wrap"
            @update:options="options = $event"
          >
            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="deleteUser(item.raw.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <VBtn
                icon
                size="small"
                color="medium-emphasis"
                variant="text"
                @click="openEditParishDialog(item)"
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
                  {{ paginationMeta(options, totalParish) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalParish / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalParish / options.itemsPerPage)"
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

        <!-- 👉 Create parish dialog -->
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateCommitteeDialog v-model:is-dialog-visible="isCreateCommitteeVisible" />
        </VCol>

        <!-- 👉 Edit parish dialog -->
        <VCol
         
          cols="12"
          sm="6"
          md="4"
        >
          <EditParishDialog
            v-model:is-dialog-visible="isEditParishVisible"
            :parish-data="parishData"
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
