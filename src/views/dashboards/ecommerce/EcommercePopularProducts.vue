<script setup>
const userData = JSON.parse(localStorage.getItem('userData') || 'null')
import dayjs from 'dayjs'
import { ref, onMounted } from 'vue'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
const apiResponseStatus = ref('')
const apiResponseMessage = ref('')
const isCreateAnnouncementVisible = ref(false)
const currentAnnouncement = ref(null);
const currentPart = ref('title');
const announcementIndex = ref(0);
let timer = null;
const formatDate = (dateString) => {
  return dayjs(dateString).format('dddd, D MMMM YYYY'); // Format as "Sunday, 21st May 2024"
};
// Default schedule fallback
const defaultAnnouncements = [
  {
    title: 'Community Clean-Up',
    message: 'Join us for a community clean-up day to help keep our surroundings tidy!',
    date: '2024-10-15'
  },
  {
    title: 'Fundraising Event',
    message: 'We are holding a fundraising event for the church on October 20th. Your support is appreciated!',
    date: '2024-10-20'
  },
  {
    title: 'Bible Study Series',
    message: 'Join us every Monday evening for our Bible study series starting October 23rd.',
    date: '2024-10-23'
  },
  {
    title: 'Youth Retreat',
    message: 'A weekend youth retreat is planned for November 10-12. Sign up at the front desk.',
    date: '2024-11-10'
  },
  {
    title: 'Christmas Service',
    message: 'Don’t miss our special Christmas service on December 24th at 6 PM.',
    date: '2024-12-24'
  },
];


// Dynamic church schedule fetched from the API
const churchAnnoucement = ref([])

// Function to get the date of each day of the week
const getWeekDates = () => {
  const startOfWeek = dayjs().startOf('week') // Sunday
  return defaultAnnouncements.map((announcement, index) => {
    const formattedDate = startOfWeek.add(index, 'day').format('dddd, D MMMM YYYY')
    return { ...announcement, date: formattedDate }
  })
}

const changes = () => {
  fetchSchedules()
  isCreateAnnouncementVisible.value = false
}
// Fetch schedule from API
const fetchAnnouncements = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    const parishCode = userData.parishcode || 'default_parish_code'

    const response = await api.get(`/getAnnouncement/${parishCode}`)
    if (response.data.status === 200 && response.data.schedules.length > 0) {
      // Fetched data from API
      const fetchedAnnouncements = response.data.schedules

      // Map over default announcements and replace with fetched ones if dates match
      churchAnnoucement.value = defaultAnnouncements.map((defaultSchedule) => {
        // Find the corresponding schedule from the database that matches the date
        const dbSchedule = fetchedAnnouncements.find(schedule => 
          dayjs(schedule.date).isSame(defaultSchedule.date, 'day') // Compare dates using dayjs
        )

        // If a schedule exists for this day, overwrite the default announcement
        if (dbSchedule) {
          return {
            ...defaultSchedule,
            title: dbSchedule.event,
            message: dbSchedule.person,
            date: dayjs(dbSchedule.date).format('dddd, D MMMM YYYY') // Format the date
          }
        }

        // Otherwise, return the default announcement with the formatted date
        return {
          ...defaultSchedule,
          date: dayjs(defaultSchedule.date).format('dddd, D MMMM YYYY') // Format the date
        }
      })
    } else {
      // No announcements found, fallback to default
      churchAnnoucement.value = getWeekDates()
    }
  } catch (error) {
    console.error('Error fetching announcements:', error)
    churchAnnoucement.value = getWeekDates() // Fallback to default in case of an error
  }
}


// Fetch schedules on component mount
onMounted(fetchAnnouncements)

const cycleAnnouncementParts = () => {
  const parts = ['title', 'message', 'date'];
  let partIndex = 0;

  timer = setInterval(() => {
    currentPart.value = parts[partIndex];
    partIndex = (partIndex + 1) % parts.length; // Cycle through parts

    if (partIndex === 0) {
      // Move to the next announcement after showing all parts (title, message, date)
      nextAnnouncement();
    }
  }, 3000); // Change part every 3 seconds (adjust as needed)
};

// Function to move to the next announcement
const nextAnnouncement = () => {
  announcementIndex.value = (announcementIndex.value + 1) % churchAnnoucement.value.length;
  currentAnnouncement.value = churchAnnoucement.value[announcementIndex.value];
};

// Lifecycle hook to start cycling the announcements
onMounted(() => {
  currentAnnouncement.value = churchAnnoucement.value[0]; // Start with the first announcement
  cycleAnnouncementParts(); // Start cycling between parts
});

// Clean up the timer when the component is destroyed
watch(announcementIndex, () => {
  clearInterval(timer);
  cycleAnnouncementParts(); // Reset the timer for the next announcement
});
</script>

<template>
  <VCard title="Announcements" subtitle="Latest announcements from church">
    <VDivider class="mb-4" />

    <!-- Centered Add Announcement Button -->
    <div class="d-flex justify-center mb-4">
      <VBtn v-if="userData.role === 'Admin'" prepend-icon="tabler-plus"
        @click="isCreateAnnouncementVisible = !isCreateAnnouncementVisible">
        Add Announcement
      </VBtn>
    </div>

    <VCardText>
      <div class="announcements-wrapper">
        <div v-if="currentAnnouncement">
          <div class="announcement-section">
            <transition name="fade">
              <div v-if="currentPart === 'title'" class="announcement-title">
                <h4>{{ currentAnnouncement.title }}</h4>
              </div>
            </transition>

            <transition name="fade">
              <div v-if="currentPart === 'message'" class="announcement-message">
                <p>{{ currentAnnouncement.message }}</p>
              </div>
            </transition>

            <transition name="fade">
              <div v-if="currentPart === 'date'" class="announcement-date">
                <p>{{ formatDate(currentAnnouncement.date) }}</p>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </VCardText>

    <VCol cols="12" sm="6" md="4">
      <CreateAnnouncementDialog v-model:is-dialog-visible="isCreateAnnouncementVisible" @changes="changes" />
    </VCol>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 23px;
}
</style>
<style scoped>
.announcements-wrapper {
  height: 200px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.announcement-section {
  display: flex;
  flex-direction: column;
}

.announcement-title,
.announcement-message,
.announcement-date {
  opacity: 0;
  transition: opacity 1s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

.card-list {
  animation: scroll 10s linear infinite;
}

/* Define scrolling animation */
@keyframes scroll {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(-100%);
  }
}
</style>
