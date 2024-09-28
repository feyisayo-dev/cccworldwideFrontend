<script setup>
import { VIcon } from 'vuetify/components/VIcon'
import sliderBar1 from '@images/illustrations/sidebar-pic-1.png'
import sliderBar2 from '@images/illustrations/sidebar-pic-2.png'
import sliderBar3 from '@images/illustrations/sidebar-pic-3.png'

import {
  blankEvent,
  useCalendar,
} from '@/views/apps/calendar/useCalendar'
import { useCalendarStore } from '@/views/apps/calendar/useCalendarStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import { paginationMeta } from '@/@fake-db/utils'
import { useAllAdminActions } from '@/apiservices/adminActions'
import api from '@/apiservices/api'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { ref, computed, watchEffect } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const calendarRef = ref(null)
const AllAdminActions = useAllAdminActions()
const calendarApi = ref(null)

import CalendarEventHandler from '@/views/apps/calendar/AddEventCalenderHandler.vue'

const store = useCalendarStore()
const events = ref([])

// 👉 Event
const eventData = ref({})

const checkAll = computed({
  get: () => store.selectedCalendars.length === store.availableCalendars.length,
  set: val => {
    if (val)
      store.selectedCalendars = store.availableCalendars.map(i => i.label)
    else if (store.selectedCalendars.length === store.availableCalendars.length)
      store.selectedCalendars = []
  },
})

function getRandomColor() {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  
  return color
}


const FetchAllEvent = () => {
  AllAdminActions.fetchAllEvents()
    .then(response => {
      if (response.data.events && response.data.events.length > 0) {
        events.value = response.data.events.map(event => ({
          id: event.EventId,           
          title: event.Title,
          start: `${event.startdate}T${event.start_time}`,
          end: `${event.enddate}T${event.end_time}`,
          color: getRandomColor(),
          textColor: 'white',
          extendedProps: {             
            description: event.Description,
            time: event.Time,
            moderator: event.Moderator,
            minister: event.Minister,
            guest: event.guest,
            location: event.location,
            type: event.Type,
            parishCode: event.parishcode,
            parishName: event.parishname,
            eventImg: event.eventImgsPublicpath,
          },
        }))
        console.log("This is the Events", events.value)
      } else {
        console.log("No events available.")
      }
    })
    .catch(error => {
      console.error("Error fetching events:", error)
    })
}

watchEffect(FetchAllEvent)

const calendarOptions = computed(() => {
  const options = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'prev,next title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    events: events.value, // Use the reactive events array
    forceEventDuration: true,
    editable: false,
    dragScroll: true,
    dayMaxEvents: 4,
    navLinks: true,
    eventMouseEnter: info => {
      const { event } = info

      const content = `
        <div style="text-align: left;">
          <img src="${event.extendedProps.eventImg}" alt="${event.title}" style="width: 100%; height: auto;" />
          <h3>${event.title}</h3>
          <p>${event.title}, to be held on ${event.start.toLocaleDateString()} to ${event.end ? event.end.toLocaleDateString() : 'N/A'}, in ${event.extendedProps.location}, brought to you by ${event.extendedProps.parishName}.</p>
          <p>People to be there: ${event.extendedProps.guest}, ${event.extendedProps.minister}, moderated by ${event.extendedProps.moderator}.</p>
          <p><strong>Description:</strong> ${event.extendedProps.description}</p>
        </div>
      `

      tippy(info.el, {
        content,
        allowHTML: true,
        placement: 'top',
        theme: 'translucent',
        maxWidth: 300,
        arrow: true,
        animation: 'rubberBand',
      })
    },
    eventMouseLeave: info => {
      const tooltip = info.el._tippy
      if (tooltip) {
        tooltip.destroy()
      }
    },
    eventClick: info => {
      const { event } = info

      let guest = ''
      let Sermoner = ''
      if (event.extendedProps.minister) {
        if (event.extendedProps.minister.includes(',')) {
          const ministerParts = event.extendedProps.minister.split(',')

          guest = ministerParts[0]?.trim() || ''
          Sermoner = ministerParts[1]?.trim() || ''
        } else {
          guest = event.extendedProps.minister.trim()
          Sermoner = null
        }
      }else{
        console.log("No minister here")
      }

      eventData.value = {
        ...event.extendedProps,
        title: event.title,
        start: event.start,
        end: event.end,
        id: event.id,
        guest: guest,
        Sermoner: Sermoner,
      }
      console.log("Updated eventData:", eventData.value)
    },
  }

  console.log("Calendar Options:", options) 
  
  return options
})

const handleDateChange = value => {
  const selectedDate = value

  console.log("This is the value", selectedDate)
  calendarRef.value.getApi().gotoDate(selectedDate)
}

const websiteAnalytics = [
  {
    name: 'Traffic',
    slideImg: sliderBar1,
    data: [
      {
        number: '1.5k',
        text: 'Sessions',
      },
      {
        number: '3.1k',
        text: 'Page Views',
      },
      {
        number: '1.2k',
        text: 'Leads',
      },
      {
        number: '12%',
        text: 'Conversions',
      },
    ],
  },
  {
    name: 'Spending',
    slideImg: sliderBar2,
    data: [
      {
        number: '12h',
        text: 'Spend',
      },
      {
        number: '182',
        text: 'Order Size',
      },
      {
        number: '127',
        text: 'Order',
      },
      {
        number: '23k',
        text: 'Items',
      },
    ],
  },
  {
    name: 'Revenue Sources',
    slideImg: sliderBar3,
    data: [
      {
        number: '268',
        text: 'Direct',
      },
      {
        number: '890',
        text: 'Organic',
      },
      {
        number: '622',
        text: 'Referral',
      },
      {
        number: '1.2k',
        text: 'Campaign',
      },
    ],
  },
]
</script>

<template>
  <VCard color="primary">
    <VMain>
      <VCard flat>
        <FullCalendar
          ref="calendarRef"
          :options="calendarOptions"
        />
      </VCard>
    </VMain>
  </VCard>
</template>

<style lang="scss">
.card-website-analytics-img {
  block-size: 150px;
}

@media screen and (min-width: 600px) {
  .card-website-analytics-img {
    position: absolute;
    margin: auto;
    inset-block-end: 40px;
    inset-block-start: -1rem;
    inset-inline-end: 1rem;
  }
}

.web-analytics-carousel {
  .v-carousel__controls {
    .v-btn:not(.v-btn--active) {
      opacity: 0.4;
    }
  }
}
</style>

<style lang="scss">
@use "@core/scss/template/libs/full-calendar";

.calendars-checkbox {
  .v-label {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    opacity: var(--v-high-emphasis-opacity);
  }
}

.calendar-add-event-drawer {
  &.v-navigation-drawer:not(.v-navigation-drawer--temporary) {
    border-end-start-radius: 0.375rem;
    border-start-start-radius: 0.375rem;
  }
}

.calendar-date-picker {
  display: none;

  +.flatpickr-input {
    +.flatpickr-calendar.inline {
      border: none;
      box-shadow: none;

      .flatpickr-months {
        border-block-end: none;
      }
    }
  }

  & ~ .flatpickr-calendar .flatpickr-weekdays {
    margin-block: 0 4px;
  }
}
</style>

<style lang="scss" scoped>
.v-layout {
  overflow: visible !important;

  .v-card {
    overflow: visible;
  }
}
</style>
