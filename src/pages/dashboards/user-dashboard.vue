<script setup>
import EditMemberDialog from "@/components/dialogs/EditMemberDialog.vue";
import EcommerceEarningReports from "@/views/dashboards/ecommerce/EcommerceEarningReports.vue";
import EcommerceExpensesRadialBarCharts from "@/views/dashboards/ecommerce/EcommerceExpensesRadialBarCharts.vue";
import EcommerceGeneratedLeads from "@/views/dashboards/ecommerce/EcommerceGeneratedLeads.vue";
import EcommerceInvoiceTable from "@/views/dashboards/ecommerce/EcommerceInvoiceTable.vue";
import EcommerceOrder from "@/views/dashboards/ecommerce/EcommerceOrder.vue";
import EcommercePopularProducts from "@/views/dashboards/ecommerce/EcommercePopularProducts.vue";
import EcommerceRevenueReport from "@/views/dashboards/ecommerce/EcommerceRevenueReport.vue";
import EcommerceStatistics from "@/views/dashboards/ecommerce/EcommerceStatistics.vue";
import EcommerceTotalProfitLineCharts from "@/views/dashboards/ecommerce/EcommerceTotalProfitLineCharts.vue";
import EcommerceTransactions from "@/views/dashboards/ecommerce/EcommerceTransactions.vue";
import { paginationMeta } from "@/@fake-db/utils";
import { useUserListStore } from "@/apiservices/membersList";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import congoImg from "@images/illustrations/congo-illustration.png";
import { ref, watchEffect, onMounted } from "vue";
import AnalyticsWebsiteAnalytics from "@/views/dashboards/analytics/AnalyticsWebsiteAnalytics.vue";

import { useAllAdminActions } from "@/apiservices/adminActions";
import api from "@/apiservices/api";

const apiResponseStatus = ref("");
const apiResponseMessage = ref("");

const earningsReports = ref([]);
const totalEarnings = ref(0);

const userData = JSON.parse(localStorage.getItem("userData") || "null");
const selectedUserData = ref(null);

console.log("<=======This is the UserId=========>", userData.UserId);
console.log("<=======This is the UserId=========>", userData);
console.log("<=======This is the UserId=========>", userData.Title);
console.log("<=======This is the UserId=========>", userData.fname);
console.log("<=======This is the UserId=========>", userData.sname);

const genderTitle = () => {
  return userData.Gender === "Male" ? "Mr." : "Mrs./Miss";
};

const isEditDialogVisible = ref(false);

const userListStore = useUserListStore();
const totalPage = ref(1);
const totalUser = ref(0);
const user = ref([]);
const userTiles = ref([]);

const statistics = [
  {
    title: "Tithe",
    stats: "230k",
    icon: "tabler-chart-pie-2",
    color: "primary",
  },
  {
    title: "Offering",
    stats: "8.549k",
    icon: "tabler-users",
    color: "info",
  },
  {
    title: "Committee Payment",
    stats: "1.423k",
    icon: "tabler-shopping-cart",
    color: "error",
  },
  {
    title: "Building levy",
    stats: "$9745",
    icon: "tabler-currency-dollar",
    color: "success",
  },
];

const calculateProgress = (amount) => {
  const maxProgress = 1000; // Example maximum threshold for progress

  return Math.min((amount / maxProgress) * 100, 100); // Ensure progress is capped at 100
};

const updateEarningsReports = (paymentTotals) => {
  earningsReports.value = [
    {
      color: "primary",
      icon: "tabler-currency-dollar",
      title: "Building Levy",
      amount: `₦${paymentTotals.buildingLevyPayments.toFixed(2)}`, // Total for building levy payments
      progress: calculateProgress(paymentTotals.buildingLevyPayments), // Function to calculate progress
    },
    {
      color: "info",
      icon: "tabler-chart-pie-2",
      title: "Committee",
      amount: `₦${paymentTotals.committeePayments.toFixed(2)}`, // Total for committee payments
      progress: calculateProgress(paymentTotals.committeePayments),
    },
    {
      color: "success",
      icon: "tabler-brand-paypal",
      title: "Offering",
      amount: `₦${paymentTotals.offeringPayments.toFixed(2)}`, // Total for offering payments
      progress: calculateProgress(paymentTotals.offeringPayments),
    },
    {
      color: "success",
      icon: "tabler-brand-paypal",
      title: "Tithe",
      amount: `₦${paymentTotals.tithePayments.toFixed(2)}`, // Total for tithe payments
      progress: calculateProgress(paymentTotals.tithePayments),
    },
    {
      color: "warning",
      icon: "tabler-currency-dollar",
      title: "Baptism",
      amount: `₦${paymentTotals.baptismPayments.toFixed(2)}`, // Total for baptism payments
      progress: calculateProgress(paymentTotals.baptismPayments),
    },
  ];
};

const fetchAllPayments = async () => {
  try {
    const response = await api.get(`/getMemberPayment/${userData.UserId}`);
    const payments = response.data;

    const paymentTotals = {
      buildingLevyPayments: 0,
      committeePayments: 0,
      offeringPayments: 0,
      baptismPayments: 0,
      tithePayments: 0,
    };

    payments.forEach((payment) => {
      switch (
        payment.payment_type.toLowerCase() // Ensure consistent comparison with lowercase
      ) {
        case "buildinglevy":
          paymentTotals.buildingLevyPayments += Number(payment.amount); // Convert to number
          break;
        case "committee":
          paymentTotals.committeePayments += Number(payment.amount); // Convert to number
          break;
        case "offering":
          paymentTotals.offeringPayments += Number(payment.amount); // Convert to number
          break;
        case "baptism":
          paymentTotals.baptismPayments += Number(payment.amount); // Convert to number
          break;
        case "tithe":
          paymentTotals.tithePayments += Number(payment.amount); // Convert to number
          break;
        default:
          break;
      }
    });

    // Update the earnings reports with the calculated totals
    updateEarningsReports(paymentTotals);
  } catch (error) {
    console.error("Error fetching payments:", error);
  }
};

onMounted(() => {
  fetchAllPayments();
});

const form = ref({
  Tithe: "",
  Offering: "",
  Committee: "",
  Building: "",
});

const EditMemberDialogHandler = () => {
  selectedUserData.value = userData;
  isEditDialogVisible.value = true;
  console.log("Clicked", selectedUserData.value);
};
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12" md="5" lg="4">
      <VCard>
        <VRow no-gutters>
          <VCol cols="8">
            <VCardText>
              <h6 class="text-lg text-no-wrap font-weight-medium">
                Hello {{ genderTitle() }} {{ userData.fname }}
                {{ userData.mname }} {{ userData.sname }} 🎉
              </h6>
              <p class="mb-2">
                {{ userData.Title }}
              </p>
              <h4 class="text-h4 font-weight-medium text-primary mb-1">
                Welcome to {{ userData.parishname }}'s portal
              </h4>
              <VBtn @click="EditMemberDialogHandler"> Edit profile </VBtn>
            </VCardText>
          </VCol>

          <VCol cols="4">
            <VCardText class="pb-0 px-0 position-relative h-100">
              <VImg
                :src="userData.avatar || congoImg"
                height="147"
                class="congo-john-img w-100"
              />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <VCol cols="12" md="7" lg="8">
      <VCard title="Payment Stats">
        <template #append>
          <span class="text-sm text-disabled">Updated few seconds ago</span>
        </template>

        <VCardText class="pt-6">
          <VRow>
            <VCol
              v-for="report in earningsReports"
              :key="report.title"
              cols="12"
              sm="4"
            >
              <div class="d-flex align-center">
                <VAvatar
                  rounded
                  size="26"
                  :color="report.color"
                  variant="tonal"
                  class="me-2"
                >
                  <VIcon size="18" :icon="report.icon" />
                </VAvatar>

                <h6 class="text-base font-weight-medium">
                  {{ report.title }}
                </h6>
              </div>
              <h4 class="text-h4 my-3">
                {{ report.amount }}
              </h4>
              <VProgressLinear
                :model-value="report.progress"
                :color="report.color"
                height="4"
                rounded
                rounded-bar
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="12">
      <AnalyticsWebsiteAnalytics />
    </VCol>

    <VCol cols="12" lg="4">
      <VRow>
        <!-- 👉 Expenses Radial Bar Charts -->
        <VCol cols="12" lg="6" md="3" sm="6">
          <EcommerceExpensesRadialBarCharts />
        </VCol>

        <!-- 👉 Total Profit Line -->
        <VCol cols="12" lg="6" md="3" sm="6">
          <EcommerceTotalProfitLineCharts />
        </VCol>

        <!-- 👉 Generated Leads -->
        <VCol cols="12" md="6" lg="12">
          <EcommerceGeneratedLeads />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Revenue Report -->
    <VCol cols="12" lg="8">
      <EcommerceRevenueReport />
    </VCol>

    <!-- 👉 Earning Reports -->
    <VCol cols="12" sm="6" lg="4">
      <EcommerceEarningReports />
    </VCol>

    <!-- 👉 Popular Products -->
    <VCol cols="12" sm="6" lg="4">
      <EcommercePopularProducts />
    </VCol>

    <!-- 👉 Order -->
    <VCol cols="12" sm="6" lg="4">
      <EcommerceOrder />
    </VCol>

    <!-- 👉 Transaction -->
    <VCol cols="12" sm="6" lg="4">
      <EcommerceTransactions />
    </VCol>

    <!-- 👉 Invoice Table -->
    <VCol cols="12" lg="8">
      <EcommerceInvoiceTable />
    </VCol>
  </VRow>
  <EditMemberDialog
    v-model:isDialogVisible="isEditDialogVisible"
    :user-data="userData"
  />
</template>

<style>
.congo-john-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 1.25rem;
}
</style>
