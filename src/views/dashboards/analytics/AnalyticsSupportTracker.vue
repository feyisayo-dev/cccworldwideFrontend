<script setup>
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { onMounted, ref } from 'vue'

const userData = JSON.parse(localStorage.getItem('userData') || 'null')
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const vuetifyTheme = useTheme()
const series = [100]

const form = ref({
  ChruchName: userData.parishname || '',
  Malemembers: [''],
  Femalemembers: [''],
  members: [''],
  MaleMembersCount: [''],
  FemaleMembersCount: [''],
  MembersCount: [''],
})


const chartOptions = computed(() => {
  const currentTheme = vuetifyTheme.current.value.colors
  const variableTheme = vuetifyTheme.current.value.variables
  
  return {
    labels: ['Completed Task'],
    chart: { type: 'radialBar' },
    plotOptions: {
      radialBar: {
        offsetY: 10,
        startAngle: -140,
        endAngle: 130,
        hollow: { size: '65%' },
        track: {
          background: currentTheme.surface,
          strokeWidth: '100%',
        },
        dataLabels: {
          name: {
            offsetY: -20,
            color: `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['disabled-opacity'] })`,
            fontSize: '13px',
            fontWeight: '400',
            fontFamily: 'Public Sans',
          },
          value: {
            offsetY: 10,
            color: `rgba(${ hexToRgb(currentTheme['on-background']) },${ variableTheme['high-emphasis-opacity'] })`,
            fontSize: '38px',
            fontWeight: '400',
            fontFamily: 'Public Sans',
          },
        },
      },
    },
    colors: [currentTheme.primary],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        shadeIntensity: 0.5,
        gradientToColors: [currentTheme.primary],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.6,
        stops: [
          30,
          70,
          100,
        ],
      },
    },
    stroke: { dashArray: 10 },
    grid: {
      padding: {
        top: -20,
        bottom: 5,
      },
    },
    states: {
      hover: { filter: { type: 'none' } },
      active: { filter: { type: 'none' } },
    },
    responsive: [{
      breakpoint: 960,
      options: { chart: { height: 340 } },
    }],
  }
})


const fetchMembersbyParish = message => {
  if (message) {
    try {
      api.get(`/Fetchmemberbyparish/${userData.parishcode}`)
        .then(response => {
          // Ensure response.data.records is correctly set
          form.value.members = response.data.records.map(member => ({
            ...member,
            MemberName: `${member.fname} ${member.mname ? member.mname + ' ' : ''}${member.sname}`,
          }))
          console.log("This is the member", form.value.members)
          let MaleMembersCount = 0
          let FemaleMembersCount = 0
          let MembersCount = 0

          // Filter and map the members to separate males and females
          form.value.Malemembers = form.value.members
            .filter(member => member.Gender === 'Male')
            .map(member => ({
              ...member,
              fullName: `${member.fname} ${member.mname ? member.mname + ' ' : ''}${member.sname}`,
            }))
          MaleMembersCount = form.value.Malemembers.length
          MembersCount += MaleMembersCount
          form.value.MaleMembersCount = MaleMembersCount

          form.value.Femalemembers = form.value.members
            .filter(member => member.Gender === 'Female')
            .map(member => ({
              ...member,
              fullName: `${member.fname} ${member.mname ? member.mname + ' ' : ''}${member.sname}`,
            }))
          FemaleMembersCount = form.value.Femalemembers.length
          MembersCount += FemaleMembersCount
          form.value.FemaleMembersCount = FemaleMembersCount


          form.value.MembersCount = MembersCount

          console.log("This is the separation by gender", "Male:", form.value.Malemembers, "Female:", form.value.Femalemembers, "Count of male", form.value.MaleMembersCount, "Count of Female", form.value.FemaleMembersCount, "Total Count", form.value.MembersCount)
        })
        .catch(error => {
          console.error("Error submitting data:", error)
        })
    } catch (error) {
      console.error('Error:', error)
    }
  }
}

watchEffect(fetchMembersbyParish)

const MemberDetails = computed(() => [
  {
    avatarColor: 'primary',
    avatarIcon: 'tabler-ticket',
    title: 'Male Members',
    subtitle: form.value.MaleMembersCount, 
  },
  {
    avatarColor: 'info',
    avatarIcon: 'tabler-circle-check',
    title: 'Female Members',
    subtitle: form.value.FemaleMembersCount, 
  },
])
</script>

<template>
  <VCard
    title="Member Tracker"
    subtitle="This is your church details"
  >
    <template #append>
      <div class="mt-n4 me-n2">
        <MoreBtn :menu-list="[{ title: 'View More', value: 'View More' }, { title: 'Delete', value: 'Delete' }]" />
      </div>
    </template>

    <VCardText>
      <VRow>
        <VCol
          cols="12"
          md="5"
          sm="6"
          class="mt-auto"
        >
          <div class="mb-6">
            <h4 class="text-h1">
              {{ form.MembersCount }}
            </h4>
            <p>
              Total Members
            </p>
          </div>

          <VList class="card-list">
            <VListItem
              v-for="memberDets in MemberDetails"
              :key="memberDets.title"
            >
              <VListItemTitle class="font-weight-medium">
                {{ memberDets.title }}
              </VListItemTitle>
              <VListItemSubtitle class="text-disabled">
                {{ memberDets.subtitle }}
              </VListItemSubtitle>
              <template #prepend>
                <VAvatar
                  rounded
                  size="34"
                  :color="memberDets.avatarColor"
                  variant="tonal"
                >
                  <VIcon :icon="memberDets.avatarIcon" />
                </VAvatar>
              </template>
            </VListItem>
          </VList>
        </VCol>
        <VCol
          cols="12"
          md="7"
          sm="6"
        >
          <VueApexCharts
            :options="chartOptions"
            :series="series"
            height="340"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 18px;
}
</style>
