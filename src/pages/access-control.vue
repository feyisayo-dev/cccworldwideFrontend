<script setup>
import EcommerceEarningReports from '@/views/dashboards/ecommerce/EcommerceEarningReports.vue'
import EcommerceExpensesRadialBarCharts from '@/views/dashboards/ecommerce/EcommerceExpensesRadialBarCharts.vue'
import EcommerceGeneratedLeads from '@/views/dashboards/ecommerce/EcommerceGeneratedLeads.vue'
import EcommerceInvoiceTable from '@/views/dashboards/ecommerce/EcommerceInvoiceTable.vue'
import EcommerceOrder from '@/views/dashboards/ecommerce/EcommerceOrder.vue'
import EcommercePopularProducts from '@/views/dashboards/ecommerce/EcommercePopularProducts.vue'
import EcommerceRevenueReport from '@/views/dashboards/ecommerce/EcommerceRevenueReport.vue'
import EcommerceStatistics from '@/views/dashboards/ecommerce/EcommerceStatistics.vue'
import EcommerceTotalProfitLineCharts from '@/views/dashboards/ecommerce/EcommerceTotalProfitLineCharts.vue'
import EcommerceTransactions from '@/views/dashboards/ecommerce/EcommerceTransactions.vue'
import { paginationMeta } from '@/@fake-db/utils'
import { useUserListStore } from '@/apiservices/membersList'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import congoImg from '@images/illustrations/congo-illustration.png'


const userData = JSON.parse(localStorage.getItem('userData') || 'null')
const selectedUserData = ref(null)

console.log("<=======This is the UserId=========>", userData.UserId)
console.log("<=======This is the UserId=========>", userData)
console.log("<=======This is the UserId=========>", userData.Title)
console.log("<=======This is the UserId=========>", userData.fname)
console.log("<=======This is the UserId=========>", userData.sname)

const isEditDialogVisible = ref(false)

const userListStore = useUserListStore()
const totalPage = ref(1)
const totalUser = ref(0)
const user = ref([])
const userTiles = ref([])

const EditUserDialog = () => {
  selectedUserData.value = userData
  isEditDialogVisible.value = true
  console.log("Clicked", selectedUserData.value)
}
</script>


<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <VCard>
        <VRow no-gutters>
          <VCol cols="8">
            <VCardText>
              <h6 class="text-lg text-no-wrap font-weight-medium">
                Hello {{ userData.Title }} {{ userData.fname }} {{ userData.sname }} 🎉
              </h6>
              <p class="mb-2">
                {{ userData.parishname }}
              </p>
              <h4 class="text-h4 font-weight-medium text-primary mb-1">
                Welcome to your portal
              </h4>
              <VBtn @click="EditUserDialog">
                Edit profile
              </VBtn>
            </VCardText>
          </VCol>

          <VCol cols="4">
            <VCardText class="pb-0 px-0 position-relative h-100">
              <VImg
                :src="congoImg"
                height="147"
                class="congo-john-img w-100"
              />
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <EcommerceStatistics class="h-100" />
    </VCol>

    <VCol
      cols="12"
      lg="4"
    >
      <VRow>
        <!-- 👉 Expenses Radial Bar Charts -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceExpensesRadialBarCharts />
        </VCol>

        <!-- 👉 Total Profit Line -->
        <VCol
          cols="12"
          lg="6"
          md="3"
          sm="6"
        >
          <EcommerceTotalProfitLineCharts />
        </VCol>

        <!-- 👉 Generated Leads -->
        <VCol
          cols="12"
          md="6"
          lg="12"
        >
          <EcommerceGeneratedLeads />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Revenue Report -->
    <VCol
      cols="12"
      lg="8"
    >
      <EcommerceRevenueReport />
    </VCol>

    <!-- 👉 Earning Reports -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceEarningReports />
    </VCol>

    <!-- 👉 Popular Products -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommercePopularProducts />
    </VCol>

    <!-- 👉 Order -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceOrder />
    </VCol>

    <!-- 👉 Transaction -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <EcommerceTransactions />
    </VCol>

    <!-- 👉 Invoice Table -->
    <VCol
      cols="12"
      lg="8"
    >
      <EcommerceInvoiceTable />
    </VCol>
  </VRow>
  <EditUserDialog
    v-if="isEditDialogVisible"
    v-model:isDialogVisible="isEditDialogVisible"
    :user-data="selectedUserData"
  />
</template>



<style>
.congo-john-img {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 1.25rem;
}
</style>
