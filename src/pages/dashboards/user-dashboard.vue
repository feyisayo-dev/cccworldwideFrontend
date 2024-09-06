<script setup>
import EditMemberDialog from '@/components/dialogs/EditMemberDialog.vue'
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
import { ref,  watchEffect } from 'vue'


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

const statistics = [
  {
    title: 'Tithe',
    stats: '230k',
    icon: 'tabler-chart-pie-2',
    color: 'primary',
  },
  {
    title: 'Offering',
    stats: '8.549k',
    icon: 'tabler-users',
    color: 'info',
  },
  {
    title: 'Committee Payment',
    stats: '1.423k',
    icon: 'tabler-shopping-cart',
    color: 'error',
  },
  {
    title: 'Building levy',
    stats: '$9745',
    icon: 'tabler-currency-dollar',
    color: 'success',
  },
]

const EditMemberDialogHandler  = () => {
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
              <VBtn @click="EditMemberDialogHandler">
                Edit profile
              </VBtn>
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

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VCard title="Stats">
        <template #append>
          <span class="text-sm text-disabled">Updated few seconds ago</span>
        </template>

        <VCardText class="pt-6">
          <VRow>
            <VCol
              v-for="payment in statistics"
              :key="payment.title"
              cols="6"
              md="3"
            >
              <div class="d-flex align-center gap-4">
                <VAvatar
                  :color="payment.color"
                  variant="tonal"
                  size="42"
                >
                  <VIcon :icon="payment.icon" />
                </VAvatar>

                <div class="d-flex flex-column">
                  <span class="text-h5 font-weight-medium">{{ payment.stats }}</span>
                  <span class="text-sm">
                    {{ payment.title }}
                  </span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
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
