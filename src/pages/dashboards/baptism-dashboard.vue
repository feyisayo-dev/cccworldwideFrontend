<script setup>
import { paginationMeta } from '@/@fake-db/utils'
import { useUserListStore } from '@/apiservices/membersList'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import api from '@/apiservices/api'
import { ref,  watchEffect } from 'vue'

const userListStore = useUserListStore()
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()
const totalPage = ref(1)
const totalUsers = ref(0)
const users = ref([])
const newDetails = ref([])
const usersTiles = ref([])
const isCreateBaptismVisible = ref(false)
let baptismData = ref([])
const isEditDialogVisible = ref(false)
const permissionName = ref('')
const userDetails = ref(null)

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
})



// Headers
const headers = [
  {
    title: 'Member Name',
    color: 'primary',
    key: 'member',
  },

  {
    title: 'Status',
    color: 'info',
    key: 'Status',
  },

  {
    title: 'Amount',
    value: 'Amount',
  },

  {
    title: 'Year of joining',
    value: 'Year_of_Joining',
  },
  
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
]

const userData = JSON.parse(localStorage.getItem('userData') || 'null')

console.log("<=======This is the UserId=========>", userData.UserId)

const postData = {
  UserId: userData.UserId,
}

// 👉 Fetching users
const fetchBaptism = () => {
  userListStore.fetchBaptismforUser({
    postData: postData,
  })
    .then(async response => {
      if (Array.isArray(response.data.records)) {
        users.value = response.data.records.map(record => {
          if (record.Status === "0") {
            record.Status = "Pending"
          } else if (record.Status === "1") {
            record.Status = "Approved"
          }
          
          return record
        })
        
        console.log("<========This is the response======>", response.data)

        // Loop through each record to fetch user details
        for (const user of users.value) {
          const UserID = user.UserId

          console.log("This is the UserId", UserID)

          // Fetch user details and add member name to each user object
          await fetchUserDetails(UserID)

          if (usersTiles.value.length > 0) {
            console.log("<===this is user tiles member===>", usersTiles.value[0].member)
            user.member = usersTiles.value[0].member
          }
        }

        console.log("<========This is the users array======>", users.value)

        totalPage.value = response.data.totalPage
        totalUsers.value = response.data.totalUsers
        options.value.page = response.data.page
      } else {
        console.error('Expected an array of records but received:', response.data.records)
      }
    })
    .catch(error => {
      console.error('Error fetching baptism records:', error)
    })
}

const fetchUserDetails = async userId => {
  try {
    const response = await api.get(`/member/${userId}`)

    if (response.data && response.data.member && response.data.member.length > 0) {
      const userDetailsData = response.data.member[0]

      console.log("Fetched user details:", userDetailsData)

      const memberName = `${userDetailsData.Title || ''} ${userDetailsData.fname || ''} ${userDetailsData.sname || ''}`.trim()

      // This ensures `usersTiles` is an array, but it only has one object (the fetched member details).
      usersTiles.value = [{ ...userDetailsData, member: memberName }]
      console.log("Processed user details:", usersTiles.value)
    } else {
      console.error("No member data found.")
    }
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("Error fetching user details:", error.response.data.message)
    } else {
      console.error("Error fetching user details:", error.message)
    }
  }
}


watchEffect(fetchBaptism)


const deleteBaptism = id => {
  userListStore.deleteBaptism(id)

  // refetch User
  fetchBaptism()
}

const EditBaptismDialog = name => {
  isEditDialogVisible.value = true
  
  baptismData.value =  users.value.raw
  
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
              -->
              <!-- 👉 Add user button -->
              <VBtn
                prepend-icon="tabler-plus"
                @click="isCreateBaptismVisible = !isCreateBaptismVisible"
              >
                Baptism Registration
              </VBtn>
            </div>
          </VCardText>

          <VDivider />

          <!-- SECTION datatable <pre>{{ users }}</pre> -->
          <VDataTableServer
            v-model:items-per-page="options.itemsPerPage"
            v-model:page="options.page"
            :items="users"
            :items-length="totalUsers"
            :headers="headers"
            class="text-no-wrap"
            @update:options="options = $event"
          >
            <!-- Actions -->
            <template #item.actions="{ item }">
              <IconBtn @click="deleteBaptism(item.raw.id)">
                <VIcon icon="tabler-trash" />
              </IconBtn>

              <VBtn
                icon
                size="small"
                color="medium-emphasis"
                variant="text"
                @click="EditBaptismDialog(item)"
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
              >
                <VIcon
                  size="24"
                  icon="tabler-dots-vertical"
                />

                <VMenu activator="parent">
                  <VList>
                    <VListItem :to="{ name: 'apps-user-view-id', params: { id: item.raw.id } }">
                      <template #prepend>
                        <VIcon icon="tabler-eye" />
                      </template>

                      <VListItemTitle>View</VListItemTitle>
                    </VListItem>

                    <VListItem link>
                      <template #prepend>
                        <VIcon icon="tabler-pencil" />
                      </template>
                      <VListItemTitle>Edit</VListItemTitle>
                    </VListItem>

                    <VListItem @click="deleteBaptism(item.raw.id)">
                      <template #prepend>
                        <VIcon icon="tabler-trash" />
                      </template>
                      <VListItemTitle>Delete</VListItemTitle>
                    </VListItem>
                  </VList>
                </VMenu>
              </VBtn>
            </template>

            <!-- pagination -->
            <template #bottom>
              <VDivider />
              <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
                <p class="text-sm text-disabled mb-0">
                  {{ paginationMeta(options, totalUsers) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalUsers / options.itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.ceil(totalUsers / options.itemsPerPage)"
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
        
        <VCol
          cols="12"
          sm="6"
          md="4"
        >
          <CreateBaptismDialog
            v-model:is-dialog-visible="isCreateBaptismVisible"
            :user-id="postData"
          />
        </VCol>
        <!-- 👉 Add New User Permission -->
        <EditBaptismDialog
          v-model:isDialogVisible="isEditDialogVisible"
          :baptism-data="baptismData"
        />
      </VCol>
    </VRow>
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
