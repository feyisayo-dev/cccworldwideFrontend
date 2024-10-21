<script setup>
import { paginationMeta } from "@/@fake-db/utils";
import { useAllAdminActions } from "@/apiservices/adminActions";
import api from "@/apiservices/api";
import { VDataTableServer } from "vuetify/labs/VDataTable";

const isConfirmDialogVisible = ref(false);
const AllAdminActions = useAllAdminActions();
const searchQuery = ref("");
const selectedRole = ref();
const selectedPlan = ref();
const selectedStatus = ref();
const totalPage = ref(1);
const totalTitle = ref(0);
const titleName = ref([]);
const Title = ref([]);
const titleId = ref(0);
const apiResponseStatus = ref("");
const apiResponseMessage = ref("");
const isPermissionDialogVisible = ref(false);
const isAddPermissionDialogVisible = ref(false);
const permissionName = ref("");
const isCreateTitleVisible = ref(false);
const isEditTitleVisible = ref(false);
let TitleData = ref([]);

const openEditTitleDialog = (Title) => {
  // Set the clicked Title data to a variable accessible by the EditTitleDialog component
  TitleData.value = Title.raw;
  isEditTitleVisible.value = true;
};

const options = ref({
  page: 1,
  itemsPerPage: 10,
  sortBy: [],
  groupBy: [],
  search: undefined,
});

// Retrieve stored data from local storage on component mount
// const storedData = JSON.parse(localStorage.getItem('tableData') || '[]')

// users.value = storedData

// Function to filter users based on search query
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const fullNameMatch = user.fullName
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    // Add additional keys for filtering
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    const genderMatch =
      user.gender.toLowerCase() === searchQuery.value.toLowerCase();

    const roleMatch =
      user.role.toLowerCase() === searchQuery.value.toLowerCase();

    // Combine the results using logical OR (||) for flexibility
    return fullNameMatch || emailMatch || genderMatch || roleMatch;

    // Add more conditions with logical OR (||) as needed
  });
});

// Table Headers
const headers = [
  {
    title: "Gender",
    key: "gender",
  },
  {
    title: "Title Name",
    key: "title",
  },
  {
    title: "Status",
    key: "status",
  },

  {
    title: "Amount",
    key: "amount",
  },

  {
    title: "Level",
    key: "level",
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
    title: "Actions",
    key: "actions",
    sortable: false,
  },
];

// 👉 Fetching Title
const fetchAllTitle = () => {
  AllAdminActions.fetchAlltitle()
    .then((response) => {
      Title.value = response.data.allTitle;

      const processedTitles = response.data.titles.map((title) => {
        const sum =
          (parseInt(title.p1) || 0) +
          (parseInt(title.p2) || 0) +
          (parseInt(title.p3) || 0) +
          (parseInt(title.p4) || 0) +
          (parseInt(title.p5) || 0) +
          (parseInt(title.p6) || 0) +
          (parseInt(title.p7) || 0) +
          (parseInt(title.p8) || 0) +
          (parseInt(title.p9) || 0);

        return { ...title, amount: sum };
      });

      titleName.value = processedTitles;

      // totalPage.value = response.data.totalPage
      // totalTitle.value = response.data.totalTitle
      // options.value.page = response.data.page
      console.log("this is the title value", processedTitles);
    })
    .catch((error) => {
      console.error(error);
    });
};

watchEffect(fetchAllTitle);

// 👉 search filters
const deleteTitle = (id) => {
  console.log(id);
  isConfirmDialogVisible.value = true;

  titleId.value = id;
};

const onDeleteTitle = () => {
  try {
    // API call to delete the item
    api
      .delete(`/title/${titleId.value}/delete`)
      .then((response) => {
        const apiResponseDetails = response.data;

        apiResponseStatus.value = apiResponseDetails.status;
        apiResponseMessage.value = apiResponseDetails.message;
        if (apiResponseStatus.value === "200") {
          fetchAllTitle();
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      })
      .finally(() => {
        isConfirmDialogVisible.value = false;
        titleId.value = null; // Reset title item ID
      });
  } catch (error) {
    console.error("Error:", error);
  }
};
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
                style="width: 6.25rem"
                @update:model-value="
                  options.itemsPerPage = parseInt($event, 10)
                "
              />
            </div>
            <VSpacer />

            <div
              class="app-user-search-filter d-flex align-center flex-wrap gap-4"
            >
              <!-- 👉 Search  -->
              <div style="inline-size: 10rem">
                <AppTextField
                  v-model="searchQuery"
                  placeholder="Search"
                  density="compact"
                />
              </div>
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
                <VIcon size="22" icon="tabler-edit" />
              </VBtn>

              <VBtn icon variant="text" size="small" color="medium-emphasis" />
            </template>

            <!-- pagination -->
            <template #bottom>
              <VDivider />
              <div
                class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
              >
                <p class="text-sm text-disabled mb-0">
                  {{ paginationMeta(options, totalTitle) }}
                </p>

                <VPagination
                  v-model="options.page"
                  :length="Math.ceil(totalTitle / options.itemsPerPage)"
                  :total-visible="
                    $vuetify.display.xs
                      ? 1
                      : Math.ceil(totalTitle / options.itemsPerPage)
                  "
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
        <VCol cols="12" sm="6" md="4">
          <CreateTitleDialog v-model:is-dialog-visible="isCreateTitleVisible" />
        </VCol>

        <!-- 👉 Edit Title dialog -->
        <VCol cols="12" sm="6" md="4">
          <EditTitleDialog
            v-model:is-dialog-visible="isEditTitleVisible"
            :title-data="TitleData"
          />
        </VCol>
      </VCol>
    </VRow>
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
