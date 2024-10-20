<script setup>
import { blankEvent, useCalendar } from "@/views/apps/calendar/useCalendar";
import { useCalendarStore } from "@/views/apps/calendar/useCalendarStore";
import { useResponsiveLeftSidebar } from "@core/composable/useResponsiveSidebar";
import { paginationMeta } from "@/@fake-db/utils";
import { useAllAdminActions } from "@/apiservices/adminActions";
import api from "@/apiservices/api";
import { VDataTableServer } from "vuetify/labs/VDataTable";
import { ref, computed, watchEffect } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
const userData = JSON.parse(localStorage.getItem("userData") || "null");

const calendarRef = ref(null);
const AllAdminActions = useAllAdminActions();
const calendarApi = ref(null);

// Components
import CalendarEventHandler from "@/views/apps/calendar/AddEventCalenderHandler.vue";

const store = useCalendarStore();
const events = ref([]);

// 👉 Event
const eventData = ref({});

const isEventHandlerSidebarActive = ref(false);

// watch(isEventHandlerSidebarActive, val => {
//   if (!val)
//     event.value = structuredClone(blankEvent)
// })

const { isLeftSidebarOpen } = useResponsiveLeftSidebar();

// 👉 Check all
const checkAll = computed({
  get: () => store.selectedCalendars.length === store.availableCalendars.length,
  set: (val) => {
    if (val)
      store.selectedCalendars = store.availableCalendars.map((i) => i.label);
    else if (store.selectedCalendars.length === store.availableCalendars.length)
      store.selectedCalendars = [];
  },
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

const FetchAllEvent = () => {
  AllAdminActions.fetchAllEvents()
    .then((response) => {
      if (response.data.events && response.data.events.length > 0) {
        events.value = response.data.events.map((event) => ({
          id: event.EventId,
          title: event.Title,
          start: `${event.startdate}T${event.start_time}`,
          end: `${event.enddate}T${event.end_time}`,
          color: getRandomColor(),
          textColor: "white",
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
        }));
        console.log("This is the Events", events.value);
      } else {
        console.log("No events available.");
      }
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
};

const changes = () => {
  FetchAllEvent();
  isEventHandlerSidebarActive.value = false;
};

watchEffect(FetchAllEvent);

const calendarOptions = computed(() => {
  const options = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
      start: "prev,next title",
      end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    events: events.value, // Use the reactive events array
    forceEventDuration: true,
    editable: false,
    dragScroll: true,
    dayMaxEvents: 4,
    navLinks: true,
    eventMouseEnter: (info) => {
      const { event } = info;

      const content = `
        <div style="text-align: left;">
          <img src="${event.extendedProps.eventImg}" alt="${
        event.title
      }" style="width: 100%; height: auto;" />
          <h3>${event.title}</h3>
          <p>${
            event.title
          }, to be held on ${event.start.toLocaleDateString()} to ${
        event.end ? event.end.toLocaleDateString() : "N/A"
      }, in ${event.extendedProps.location}, brought to you by ${
        event.extendedProps.parishName
      }.</p>
          <p>People to be there: ${event.extendedProps.guest}, ${
        event.extendedProps.minister
      }, moderated by ${event.extendedProps.moderator}.</p>
          <p><strong>Description:</strong> ${
            event.extendedProps.description
          }</p>
        </div>
      `;

      tippy(info.el, {
        content,
        allowHTML: true,
        placement: "top",
        theme: "light",
        maxWidth: 300,
      });
    },
    eventMouseLeave: (info) => {
      const tooltip = info.el._tippy;
      if (tooltip) {
        tooltip.destroy();
      }
    },
    eventClick: (info) => {
      const { event } = info;

      let guest = "";
      let Sermoner = "";
      if (event.extendedProps.minister) {
        if (event.extendedProps.minister.includes(",")) {
          const ministerParts = event.extendedProps.minister.split(",");

          guest = ministerParts[0]?.trim() || "";
          Sermoner = ministerParts[1]?.trim() || "";
        } else {
          guest = event.extendedProps.minister.trim();
          Sermoner = null;
        }
      } else {
        console.log("No minister here");
      }

      eventData.value = {
        ...event.extendedProps,
        title: event.title,
        start: event.start,
        end: event.end,
        id: event.id,
        guest: guest,
        Sermoner: Sermoner,
      };

      isEventHandlerSidebarActive.value = true;

      console.log("Updated eventData:", eventData.value);
    },
  };

  console.log("Calendar Options:", options);

  return options;
});

const handleDateChange = (value) => {
  const selectedDate = value;

  console.log("This is the value", selectedDate);
  calendarRef.value.getApi().gotoDate(selectedDate);
};
</script>

<template>
  <div>
    <VCard>
      <!-- `z-index: 0` Allows overlapping vertical nav on calendar -->
      <VLayout style="z-index: 0">
        <!-- 👉 Navigation drawer -->
        <VNavigationDrawer
          v-if="userData.role === 'Admin'"
          v-model="isLeftSidebarOpen"
          width="292"
          absolute
          touchless
          location="start"
          class="calendar-add-event-drawer"
          :temporary="$vuetify.display.mdAndDown"
        >
          <div style="margin: 1.4rem">
            <VBtn
              block
              prepend-icon="tabler-plus"
              @click="isEventHandlerSidebarActive = true"
            >
              Add event
            </VBtn>
          </div>

          <VDivider />

          <div class="d-flex align-center justify-center pa-2 mb-3">
            <AppDateTimePicker
              :model-value="new Date().toJSON().slice(0, 10)"
              :config="{ inline: true }"
              class="calendar-date-picker"
              @input="handleDateChange($event.target.value)"
            />
          </div>

          <VDivider />
          <div class="pa-7">
            <p class="text-sm text-uppercase text-disabled mb-3">FILTER</p>

            <div class="d-flex flex-column calendars-checkbox">
              <VCheckbox v-model="checkAll" label="View all" />
              <VCheckbox
                v-for="calendar in store.availableCalendars"
                :key="calendar.label"
                v-model="store.selectedCalendars"
                :value="calendar.label"
                :color="calendar.color"
                :label="calendar.label"
              />
            </div>
          </div>
        </VNavigationDrawer>

        <VMain>
          <VCard flat>
            <FullCalendar ref="calendarRef" :options="calendarOptions" />
          </VCard>
        </VMain>
      </VLayout>
    </VCard>
    <CalendarEventHandler
      v-model:isDrawerOpen="isEventHandlerSidebarActive"
      :event-data="eventData"
      @changes="changes"
    />
  </div>
</template>

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

  + .flatpickr-input {
    + .flatpickr-calendar.inline {
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
