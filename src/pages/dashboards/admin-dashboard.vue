<script setup>
import { useTheme } from 'vuetify'
import AnalyticsEarningReportsWeeklyOverview from '@/views/dashboards/analytics/AnalyticsEarningReportsWeeklyOverview.vue'
import AnalyticsMonthlyCampaignState from '@/views/dashboards/analytics/AnalyticsMonthlyCampaignState.vue'
import AnalyticsProjectTable from '@/views/dashboards/analytics/AnalyticsProjectTable.vue'
import AnalyticsSalesByCountries from '@/views/dashboards/analytics/AnalyticsSalesByCountries.vue'
import AnalyticsSalesOverview from '@/views/dashboards/analytics/AnalyticsSalesOverview.vue'
import AnalyticsSourceVisits from '@/views/dashboards/analytics/AnalyticsSourceVisits.vue'
import AnalyticsSupportTracker from '@/views/dashboards/analytics/AnalyticsSupportTracker.vue'
import AnalyticsTotalEarning from '@/views/dashboards/analytics/AnalyticsTotalEarning.vue'
import AnalyticsWebsiteAnalytics from '@/views/dashboards/analytics/AnalyticsWebsiteAnalytics.vue'
import EcommerceTransactions from '@/views/dashboards/ecommerce/EcommerceTransactions.vue'
import EcommercePopularProducts from '@/views/dashboards/ecommerce/EcommercePopularProducts.vue'
import Departments from '@/views/dashboards/ecommerce/Departments.vue'

const vuetifyTheme = useTheme()
const currentTheme = vuetifyTheme.current.value.colors

const statisticsVertical = {
  title: 'Revenue Generated',
  color: 'success',
  icon: 'tabler-credit-card',
  stats: '97.5k',
  height: 97,
  series: [{
    data: [
      300,
      350,
      330,
      380,
      340,
      400,
      380,
    ],
  }],
  chartOptions: {
    chart: {
      height: 110,
      type: 'area',
      parentHeightOffset: 0,
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    tooltip: { enabled: false },
    markers: {
      colors: 'transparent',
      strokeColors: 'transparent',
    },
    grid: { show: false },
    colors: [currentTheme.success],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.8,
        opacityFrom: 0.6,
        opacityTo: 0.1,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: 'smooth',
    },
    xaxis: {
      show: true,
      lines: { show: false },
      labels: { show: false },
      stroke: { width: 0 },
      axisBorder: { show: false },
    },
    yaxis: {
      stroke: { width: 0 },
      show: false,
    },
  },
}
</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Website analytics -->

    <!-- 👉 Earning Reports Weekly Overview -->
    <VCol
      cols="12"
      md="6"
    >
      <AnalyticsEarningReportsWeeklyOverview />
    </VCol>

    <!-- 👉 Support Tracker -->
    <VCol
      cols="12"
      md="6"
    >
      <AnalyticsSupportTracker />
    </VCol>

    <!-- 👉 Sales by Countries -->
    <VCol
      cols="12"
      md="6"
    >
      <EcommercePopularProducts />
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <EcommerceTransactions />
    </VCol>

    <!-- 👉 Project Table -->
    <VCol
      cols="12"
    >
    <Departments />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
