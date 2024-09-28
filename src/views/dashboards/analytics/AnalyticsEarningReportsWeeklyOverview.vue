<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { ref, onMounted } from 'vue'

const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const userData = JSON.parse(localStorage.getItem('userData') || 'null')

const earningsReports = ref([])
const totalEarningsThisWeek = ref(0)
const totalEarningsLastWeek = ref(0)
const earningsPercentageChange = ref(0)
const vuetifyTheme = useTheme()

const series = [{
  data: [
    40,
    65,
    50,
    45,
    90,
    55,
    70,
  ],
}]

import dayjs from 'dayjs'

const updateEarningsReports = paymentTotals => {
  earningsReports.value = [
    {
      color: 'primary',
      icon: 'tabler-currency-dollar',
      title: 'Building Levy',
      amount: `₦${paymentTotals.buildingLevyPayments.toFixed(2)}`, // Total for building levy payments
      progress: calculateProgress(paymentTotals.buildingLevyPayments), // Function to calculate progress
    },
    {
      color: 'info',
      icon: 'tabler-chart-pie-2',
      title: 'Committee',
      amount: `₦${paymentTotals.committeePayments.toFixed(2)}`, // Total for committee payments
      progress: calculateProgress(paymentTotals.committeePayments),
    },
    {
      color: 'success',
      icon: 'tabler-brand-paypal',
      title: 'Offering',
      amount: `₦${paymentTotals.offeringPayments.toFixed(2)}`, // Total for offering payments
      progress: calculateProgress(paymentTotals.offeringPayments),
    },
    {
      color: 'success',
      icon: 'tabler-brand-paypal',
      title: 'Tithe',
      amount: `₦${paymentTotals.tithePayments.toFixed(2)}`, // Total for tithe payments
      progress: calculateProgress(paymentTotals.tithePayments),
    },
    {
      color: 'warning',
      icon: 'tabler-currency-dollar',
      title: 'Baptism',
      amount: `₦${paymentTotals.baptismPayments.toFixed(2)}`, // Total for baptism payments
      progress: calculateProgress(paymentTotals.baptismPayments),
    },
  ]
}

const calculateProgress = amount => {
  const maxProgress = 1000 // Example maximum threshold for progress
  
  return Math.min((amount / maxProgress) * 100, 100) // Ensure progress is capped at 100
}

const fetchAllPayments = async () => {
  try {
    const response = await api.get(`/getChurchPayment/${userData.parishcode}`)
    const payments = response.data

    const paymentTotals = {
      buildingLevyPayments: 0,
      committeePayments: 0,
      offeringPayments: 0,
      baptismPayments: 0,
      tithePayments: 0,
    }

    payments.forEach(payment => {
      switch (payment.payment_type.toLowerCase()) {  // Ensure consistent comparison with lowercase
      case 'buildinglevy':
        paymentTotals.buildingLevyPayments += Number(payment.amount) // Convert to number
        break
      case 'committee':
        paymentTotals.committeePayments += Number(payment.amount) // Convert to number
        break
      case 'offering':
        paymentTotals.offeringPayments += Number(payment.amount) // Convert to number
        break
      case 'baptism':
        paymentTotals.baptismPayments += Number(payment.amount) // Convert to number
        break
      case 'tithe':
        paymentTotals.tithePayments += Number(payment.amount) // Convert to number
        break
      default:
        break
      }
    })

    // Update the earnings reports with the calculated totals
    updateEarningsReports(paymentTotals)

  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}

const calculateEarningsForWeek = (payments, weekStart, weekEnd) => {
  return payments.reduce((total, payment) => {
    const paymentDate = new Date(payment.datePaid)
    if (paymentDate >= weekStart && paymentDate <= weekEnd) {
      total += Number(payment.amount)
    }
    
    return total
  }, 0)
}

const fetchAndCalculateEarnings = async () => {
  try {
    const response = await api.get(`/getMemberPayment/${userData.UserId}`)
    const payments = response.data

    // Get the current date
    const today = new Date()

    // Calculate the start and end of the current week
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()))
    const currentWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))

    // Calculate the start and end of the last week
    const lastWeekStart = new Date(today.setDate(today.getDate() - today.getDay() - 7))
    const lastWeekEnd = new Date(today.setDate(today.getDate() - today.getDay() - 1))

    // Calculate total earnings for this and last week
    totalEarningsThisWeek.value = calculateEarningsForWeek(payments, currentWeekStart, currentWeekEnd)
    totalEarningsLastWeek.value = calculateEarningsForWeek(payments, lastWeekStart, lastWeekEnd)

    // Calculate the percentage change
    const difference = totalEarningsThisWeek.value - totalEarningsLastWeek.value

    earningsPercentageChange.value = totalEarningsLastWeek.value
      ? ((difference / totalEarningsLastWeek.value) * 100).toFixed(2)
      : 100 // If last week had 0 earnings, default to 100% increase

    // Update the chart with payment data for the last 7 days
    const last7DaysPayments = groupPaymentsByDay(payments)

    updateChart(last7DaysPayments) // Update chart with dynamic data

  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}


const groupPaymentsByDay = payments => {
  const last7DaysPayments = Array(7).fill(0) // Initialize an array to store payments for each day

  const today = dayjs()

  payments.forEach(payment => {
    const paymentDate = dayjs(payment.datePaid)
    const dayDifference = today.diff(paymentDate, 'day') // Calculate how many days ago the payment was made
    if (dayDifference >= 0 && dayDifference < 7) {
      last7DaysPayments[6 - dayDifference] += Number(payment.amount) // Add payment to the corresponding day
    }
  })

  return last7DaysPayments
}


// Call fetchAndCalculateEarnings when the component is mounted
onMounted(() => {
  fetchAndCalculateEarnings()
  fetchAllPayments()
})

const updateChart = seriesData => {
  series.value = [{
    data: seriesData,
  }]
}



const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables

  const last7DaysLabels = Array.from({ length: 7 }, (_, i) =>
    dayjs().subtract(i, 'day').format('MMM D'),
  ).reverse()

  return {
    chart: {
      parentHeightOffset: 0,
      type: 'bar',
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        barHeight: '60%',
        columnWidth: '55%',
        startingShape: 'rounded',
        endingShape: 'rounded',
        borderRadius: 4,
        distributed: true,
      },
    },
    grid: {
      show: false,
      padding: {
        top: -30,
        bottom: 0,
        left: -10,
        right: -10,
      },
    },
    colors: [
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,
      `rgba(${ hexToRgb(currentTheme.primary) },${ variableTheme['pressed-opacity'] })`,

      // Add colors as needed based on your theme...
    ],
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: last7DaysLabels, // Last 7 days labels for x-axis
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: `rgba(${ hexToRgb(currentTheme['on-surface']) },${ variableTheme['disabled-opacity'] })`,
          fontSize: '13px',
          fontFamily: 'Public Sans',
        },
      },
    },
    yaxis: { labels: { show: false } },
    tooltip: { enabled: true },
    responsive: [{
      breakpoint: 1025,
      options: { chart: { height: 199 } },
    }],
  }
})


const moreList = [
  {
    title: 'View More',
    value: 'View More',
  },
  {
    title: 'Delete',
    value: 'Delete',
  },
]
</script>

<template>
  <VCard>
    <VCardItem class="pb-sm-0">
      <VCardTitle>Earning Reports</VCardTitle>
      <VCardSubtitle>Weekly Earnings Overview</VCardSubtitle>

      <template #append>
        <div class="mt-n4 me-n2">
          <MoreBtn :menu-list="moreList" />
        </div>
      </template>
    </VCardItem>

    <VCardText class="mt-sm-n6">
      <VRow>
        <VCol
          cols="12"
          sm="5"
          class="d-flex flex-column align-self-end"
        >
          <div class="d-flex align-center gap-2 mb-2 pb-1 flex-wrap">
            <h4 class="text-4xl font-weight-medium">
              ₦{{ totalEarningsThisWeek.toFixed(2) }} <!-- Display this week's total earnings -->
            </h4>
            <VChip
              label
              :color="earningsPercentageChange >= 0 ? 'success' : 'error'"
            >
              {{ earningsPercentageChange >= 0 ? '+' : '' }}{{ earningsPercentageChange }}%
            </VChip>
          </div>

          <p class="text-sm">
            You informed of this week compared to last week
          </p>
        </VCol>

        <VCol
          cols="12"
          sm="7"
          class="pt-0"
        >
          <VueApexCharts
            :options="chartOptions"
            :series="series"
            height="190"
          />
        </VCol>
      </VRow>

      <div class="border rounded mt-3 px-5 py-4">
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
                <VIcon
                  size="18"
                  :icon="report.icon"
                />
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
      </div>
    </VCardText>
  </VCard>
</template>
