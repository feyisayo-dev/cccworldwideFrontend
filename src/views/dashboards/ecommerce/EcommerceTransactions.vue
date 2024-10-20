<script setup>
const userData = JSON.parse(localStorage.getItem("userData") || "null");
import dayjs from "dayjs";
import { ref, onMounted } from "vue";
import { useAllAdminActions } from "@/apiservices/adminActions";
import api from "@/apiservices/api";
const apiResponseStatus = ref("");
const apiResponseMessage = ref("");
const isCreateScheduleVisible = ref(false);

// Default schedule fallback
const defaultSchedules = [
  { day: "Sunday", event: "Sunday Service", person: "Pastor John" },
  { day: "Monday", event: "Bible Study", person: "Minister Sarah" },
  { day: "Tuesday", event: "Prayer Meeting", person: "Elder James" },
  { day: "Wednesday", event: "Mid-week Service", person: "Pastor Emily" },
  { day: "Thursday", event: "Worship Practice", person: "Music Director Mark" },
  { day: "Friday", event: "Youth Fellowship", person: "Youth Leader Grace" },
  { day: "Saturday", event: "Community Outreach", person: "Deacon Samuel" },
];

// Dynamic church schedule fetched from the API
const churchSchedules = ref([]);

// Function to get the date of each day of the week
const getWeekDates = () => {
  const startOfWeek = dayjs().startOf("week");
  return defaultSchedules.map((schedule, index) => {
    const date = startOfWeek.add(index, "day").format("D MMMM"); // e.g., "1st October"
    return { ...schedule, date };
  });
};

const changes = () => {
  fetchSchedules();
  isCreateScheduleVisible.value = false;
};
// Fetch schedule from API
const fetchSchedules = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const parishCode = userData.parishcode || "default_parish_code";

    const response = await api.get(`/getSchedule/${parishCode}`);
    if (response.data.status === 200 && response.data.schedules.length > 0) {
      const fetchedSchedules = response.data.schedules;

      const startOfWeek = dayjs().startOf("week");
      const endOfWeek = dayjs().endOf("week");

      churchSchedules.value = defaultSchedules.map((defaultSchedule, index) => {
        const dbSchedule = fetchedSchedules.find(
          (schedule) => 
            dayjs(schedule.date).isSameOrAfter(startOfWeek) &&
            dayjs(schedule.date).isSameOrBefore(endOfWeek) &&
            dayjs(schedule.date).day() === index
        );

        // Overwrite default schedule if found in the DB
        if (dbSchedule) {
          return {
            ...defaultSchedule,
            event: dbSchedule.event,
            person: dbSchedule.person,
            date: dayjs(dbSchedule.date).format("D MMMM"),
          };
        }

        // Otherwise, use the default schedule
        return {
          ...defaultSchedule,
          date: startOfWeek.add(index, "day").format("D MMMM"),
        };
      });
    } else {
      // No schedules found, fallback to default
      churchSchedules.value = getWeekDates();
    }
  } catch (error) {
    console.error("Error fetching schedules:", error);
    churchSchedules.value = getWeekDates();
  }
};

// Fetch schedules on component mount
onMounted(fetchSchedules);
</script>

<template>
  <VCard
    title="Church Service Schedule"
    subtitle="Services and Events for the Week"
  >
    <VDivider class="mb-4" />
    <div class="d-flex justify-center mb-4">
      <VBtn
        v-if="userData.role == 'Admin'"
        prepend-icon="tabler-plus"
        @click="isCreateScheduleVisible = !isCreateScheduleVisible"
      >
        Add Schedule
      </VBtn>
    </div>
    <VCardText>
      <VList class="card-list">
        <VListItem v-for="schedule in churchSchedules" :key="schedule.day">
          <template #prepend>
            <VAvatar size="34" color="primary" variant="tonal" rounded>
              <VIcon icon="tabler-calendar" />
            </VAvatar>
          </template>

          <VListItemTitle class="font-weight-medium">
            {{ schedule.event }}
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            {{ schedule.day }} - {{ schedule.date }}
          </VListItemSubtitle>

          <template #append>
            <div class="d-flex align-center">
              <span class="text-primary">{{ schedule.person }}</span>
            </div>
          </template>
        </VListItem>
      </VList>
    </VCardText>
    <VCol cols="12" sm="6" md="4">
      <CreateScheduleDialog
        v-model:is-dialog-visible="isCreateScheduleVisible"
        @changes="changes"
      />
    </VCol>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 23px;
}
</style>
