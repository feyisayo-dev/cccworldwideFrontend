<script setup>
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { paginationMeta } from "@/@fake-db/utils";
import { useInvoiceStore } from "@/views/apps/invoice/useInvoiceStore";
import api from "@/apiservices/api";
import dayjs from "dayjs";
import { ref, computed, onMounted } from "vue";

const totalPaymentsCountGlobal = ref(0);
const invoiceListStore = useInvoiceStore();
const searchQuery = ref("");
const dateRange = ref("");
const selectedStatus = ref();
const totalInvoices = ref(0);
const invoices = ref([]);
const Payments = ref([]);
const selectedRows = ref([]);
const userData = JSON.parse(localStorage.getItem("userData") || "null");

const options = ref({
  page: 1,
  itemsPerPage: 6,
  sortBy: [],
  groupBy: [],
  search: undefined,
});

const isLoading = ref(false);
const currentPage = ref(1);

currentPage.value = options.value.page;

// 👉 headers
const headers = [
  {
    title: "#ID",
    key: "id", // Corresponds to the payment ID
  },
  {
    title: "Trending",
    key: "trending", // Corresponds to the trend/status
    sortable: false,
  },
  {
    title: "Payment Type",
    key: "type", // Corresponds to 'paidfor' in the payment data
  },
  {
    title: "Payment Amount",
    key: "amount", // Corresponds to the payment amount
  },
  {
    title: "Date Issued",
    key: "date", // Corresponds to the issued date
  },
];

const fetchAllPayments = async () => {
  try {
    const response = await api.get(`/getMemberPayment/${userData.UserId}`);
    const payments = response.data;

    const totalPaymentsCount = payments.length;

    const paymentData = payments.map((payment) => {
      const date = dayjs(payment.payment_date);

      return {
        id: payment.receipt, // ID corresponds to 'receipt'
        status: "Paid", // Static or dynamic trending status
        type: payment.payment_type, // Type of payment (e.g., Building Levy, Offering, etc.)
        amount: Number(payment.amount), // Payment amount
        date: date.isValid() ? date.format("MM/DD/YYYY") : "Invalid Date", // Use Day.js to format the date
      };
    });

    // Log the total count of payments
    console.log("Total Payments Count:", totalPaymentsCount);
    totalPaymentsCountGlobal.value = totalPaymentsCount;
    Payments.value = paymentData; // Ensure this updates properly

    console.log("Payments Data:", Payments.value);
  } catch (error) {
    console.error("Error fetching payments:", error);
  }
};

onMounted(() => {
  console.log("This is the payments");
  fetchAllPayments();
});

const filteredPayments = computed(() => {
  if (!searchQuery.value) {
    return Payments.value; // Return all payments if there's no search query
  }

  const lowerCaseQuery = searchQuery.value.toLowerCase();

  return Payments.value.filter((payment) => {
    return (
      payment.id.toString().includes(lowerCaseQuery) || // ID match
      payment.type.toLowerCase().includes(lowerCaseQuery) || // Type match
      payment.amount.toString().includes(lowerCaseQuery) || // Amount match
      payment.date.includes(lowerCaseQuery) // Date match
    );
  });
});

const resolveInvoiceStatusVariantAndIcon = (status) => {
  if (status === "Partial Payment")
    return {
      variant: "success",
      icon: "tabler-circle-half-2",
    };
  if (status === "Paid")
    return {
      variant: "success",
      icon: "tabler-chart-pie",
    };
  if (status === "Downloaded")
    return {
      variant: "info",
      icon: "tabler-arrow-down-circle",
    };
  if (status === "Draft")
    return {
      variant: "primary",
      icon: "tabler-device-floppy",
    };
  if (status === "Sent")
    return {
      variant: "secondary",
      icon: "tabler-circle-check",
    };
  if (status === "Past Due")
    return {
      variant: "error",
      icon: "tabler-alert-circle",
    };

  return {
    variant: "secondary",
    icon: "tabler-x",
  };
};

const computedMoreList = computed(() => {
  return (paramId) => [
    {
      title: "Download",
      value: "download",
      prependIcon: "tabler-download",
    },
    {
      title: "Edit",
      value: "edit",
      prependIcon: "tabler-pencil",
      to: {
        name: "apps-invoice-edit-id",
        params: { id: paramId },
      },
    },
    {
      title: "Duplicate",
      value: "duplicate",
      prependIcon: "tabler-layers-intersect",
    },
  ];
});
</script>

<template>
  <VCard v-if="Payments" id="invoice-list">
    <VCardText class="d-flex align-center flex-wrap gap-4 py-4">
      <div class="me-3 d-flex gap-3">
        <AppSelect
          :model-value="options.itemsPerPage"
          :items="[
            { value: 6, title: '6' },
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'All' },
          ]"
          style="width: 6.25rem"
          @update:model-value="options.itemsPerPage = parseInt($event, 10)"
        />
        <!-- 👉 Create invoice -->
        <VBtn
          prepend-icon="tabler-plus"
          :to="{ name: 'dashboards-addmemberpayment-dashboard' }"
        >
          Create Payments
        </VBtn>
      </div>

      <VSpacer />

      <div class="d-flex align-center flex-wrap gap-4">
        <!-- 👉 Search  -->
        <div class="invoice-list-filter">
          <AppTextField
            v-model="searchQuery"
            placeholder="Search Payemnts"
            density="compact"
          />
        </div>
      </div>
    </VCardText>

    <VDivider />

    <!-- SECTION Datatable -->
    <VDataTableServer
      v-model="selectedRows"
      v-model:items-per-page="options.itemsPerPage"
      :loading="isLoading"
      :items-length="filteredPayments.length"
      :headers="headers"
      :items="filteredPayments"
      class="text-no-wrap"
      @update:options="options = $event"
    >
      <!-- Trending Header -->
      <template #column.trending>
        <VIcon size="22" icon="tabler-trending-up" />
      </template>

      <!-- id -->
      <template #item.id="{ item }">
        <RouterLink
          :to="{ name: 'apps-invoice-preview-id', params: { id: item.value } }"
        >
          #{{ item.raw.id }}
        </RouterLink>
      </template>

      <!-- trending -->
      <template #item.trending="{ item }">
        <VTooltip>
          <template #activator="{ props }">
            <VAvatar
              :size="30"
              v-bind="props"
              :color="
                resolveInvoiceStatusVariantAndIcon(item.raw.status).variant
              "
              variant="tonal"
            >
              <VIcon
                :size="20"
                :icon="resolveInvoiceStatusVariantAndIcon(item.raw.status).icon"
              />
            </VAvatar>
          </template>
          <p class="mb-0">
            {{ item.raw.status }}
          </p>
          <p class="mb-0">Balance: {{ item.raw.balance }}</p>
          <p class="mb-0">Due date: {{ item.raw.dueDate }}</p>
        </VTooltip>
      </template>

      <!-- Total -->
      <template #item.total="{ item }"> ${{ item.raw.total }} </template>

      <!-- Date -->
      <template #item.date="{ item }">
        {{ item.raw.date }}
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn @click="deleteInvoice(item.raw.id)">
          <VIcon icon="tabler-trash" />
        </IconBtn>

        <IconBtn
          :to="{ name: 'apps-invoice-preview-id', params: { id: item.raw.id } }"
        >
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <MoreBtn
          color="default"
          :menu-list="computedMoreList(item.raw.id)"
          item-props
        />
      </template>

      <!-- pagination -->

      <template #bottom>
        <VDivider />

        <div
          class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 pa-5 pt-3"
        >
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta(options, totalInvoices) }}
          </p>

          <VPagination
            v-model="options.page"
            :length="Math.ceil(totalInvoices / options.itemsPerPage)"
            :total-visible="$vuetify.display.xs ? 1 : 5"
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
    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>
