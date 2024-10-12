<script setup>
import { VDataTable } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/@fake-db/utils";
import { useProjectStore } from "@/views/dashboards/analytics/useProjectStore";
import { avatarText } from "@core/utils/formatters";

const projectStore = useProjectStore();
const searchQuery = ref("");
const isCreateDepartmentVisible = ref(false);
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = JSON.parse(localStorage.getItem('userData') || 'null')

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
});

const departments = ref([]);

// 👉 headers
const headers = [
  {
    title: "Name",
    key: "name",
  },
  {
    title: "Leader",
    key: "leader",
  },
  {
    title: "Team",
    key: "team",
  },
  {
    title: "Status",
    key: "status",
  },
  {
    title: "Actions",
    key: "actions",
    sortable: false,
  },
];

const fetchAllDepartments = async (message) => {
  if (message) {
    try {
      const response = await api.get(`/getDepartment/${userData.parishcode}`);
      
      if (response.data.departments) {
        // Initialize an array to hold the departments with member data
        const departmentsWithMembers = await Promise.all(
          response.data.departments.map(async (department) => {
            // Split the team string into an array of member IDs
            const teamMembers = department.team.split(',');

            // Fetch details for each team member
            const members = await Promise.all(
              teamMembers.map(async (memberId) => {
                const memberResponse = await api.get(`/member/${memberId}`);
                return {
                  id: memberId,
                  logo: memberResponse.data.thumbnails, // Assuming the response includes a 'logo' field
                };
              })
            );

            return {
              id: department.id,
              name: department.name,
              leader: department.leader,
              team: members, // Store the members with their logos
              status: department.status,
            };
          })
        );

        departments.value = departmentsWithMembers; // Set the fetched departments
      }

      console.log("Departments formatted for VDataTable:", departments.value);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
};


watchEffect(fetchAllDepartments)


// onMounted(() => {
//   projectStore
//     .fetchProjects()
//     .then((response) => {
//       departments.value = response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

const changes = () => {
  // fetchAllDepartments()
  isCreateDepartmentVisible.value = false
}
</script>

<template>
  <VCard v-if="departments">
    <VCardItem
      class="project-header d-flex flex-wrap justify-space-between py-4 gap-4"
    >
      <VCardTitle>Dapartments</VCardTitle>
      <div class="d-flex justify-center mb-4">
        <VBtn
          v-if="userData.role === 'Admin'"
          prepend-icon="tabler-plus"
          @click="isCreateDepartmentVisible = !isCreateDepartmentVisible"
        >
          Add Department
        </VBtn>
      </div>
      <template #append>
        <div style="inline-size: 272px">
          <AppTextField v-model="searchQuery" placeholder="Search" />
        </div>
      </template>
    </VCardItem>

    <VDivider />

    <!-- SECTION Table -->
    <VDataTable
      v-model:page="options.page"
      :items-per-page="5"
      show-select
      :search="searchQuery"
      :headers="headers"
      :items="departments"
      class="text-no-wrap"
      @update:options="options = $event"
    >
      <!-- 👉 Name -->
      <template #item.name="{ item }">
        <div class="d-flex align-center gap-3 py-2">
          <VAvatar
            :variant="!item.raw.logo.length ? 'tonal' : undefined"
            :color="!item.raw.logo.length ? 'primary' : undefined"
            size="38"
          >
            <VImg v-if="item.raw.logo.length" :src="item.raw.logo" />
            <span v-else class="font-weight-medium">{{
              avatarText(item.raw.name)
            }}</span>
          </VAvatar>

          <div>
            <p class="font-weight-medium mb-0">
              {{ item.raw.name }}
            </p>
            <span class="text-disabled text-sm">{{ item.raw.date }}</span>
          </div>
        </div>
      </template>

      <!-- 👉 team -->
      <template #item.team="{ item }">
        <div class="v-avatar-group">
          <VAvatar
            v-for="(avatar, index) in item.raw.team"
            :key="index"
            :size="30"
            :image="avatar"
          />
        </div>
      </template>

      <!-- 👉 Status -->
      <template #item.status="{ item }">
        <div class="d-flex align-center gap-3" style="min-inline-size: 150px">
          <div class="flex-grow-1">
            <VProgressLinear
              :model-value="item.raw.status"
              color="primary"
              height="8"
              rounded
              rounded-bar
            />
          </div>
          <span>{{ item.raw.status }}%</span>
        </div>
      </template>

      <!-- 👉 Actions -->
      <template #item.actions>
        <MoreBtn
          color="default"
          :menu-list="[
            { title: 'Details', value: 'Details' },
            { title: 'Archive', value: 'Archive' },
          ]"
        />
      </template>

      <template #bottom>
        <VDivider />

        <div
          class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 pa-5 pt-3"
        >
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta(options, departments.length) }}
          </p>

          <VPagination
            v-model="options.page"
            :total-visible="
              Math.ceil(departments.length / options.itemsPerPage)
            "
            :length="Math.ceil(departments.length / options.itemsPerPage)"
          >
            <template #next="slotProps">
              <VBtn
                v-bind="slotProps"
                :icon="false"
                variant="tonal"
                color="default"
              >
                Next
              </VBtn>
            </template>

            <template #prev="slotProps">
              <VBtn
                v-bind="slotProps"
                :icon="false"
                variant="tonal"
                color="default"
              >
                Previous
              </VBtn>
            </template>
          </VPagination>
        </div>
      </template>
    </VDataTable>
    <!-- !SECTION -->
  </VCard>
  <VCol cols="12" sm="6" md="4">
    <CreateDepartmentDialog
      v-model:is-dialog-visible="isCreateDepartmentVisible"
      @changes="changes"
    />
  </VCol>
</template>

<style lang="scss">
.project-header .v-card-item__append {
  padding-inline-start: 0;
}
</style>
