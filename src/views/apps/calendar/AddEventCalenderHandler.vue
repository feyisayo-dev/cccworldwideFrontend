<script setup>
import avatar1 from "@images/avatars/avatar-1.png";
import avatar2 from "@images/avatars/avatar-2.png";
import avatar3 from "@images/avatars/avatar-3.png";
import avatar5 from "@images/avatars/avatar-5.png";
import avatar6 from "@images/avatars/avatar-6.png";
import EventDefualt from "@images/avatars/event_defualt.jpeg";

import { requiredValidator, urlValidator } from "@validators";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import { VForm } from "vuetify/components/VForm";
import { useCalendarStore } from "./useCalendarStore";
import { onMounted, ref, computed } from "vue";
import api from "@/apiservices/api";

const props = defineProps({
  isDrawerOpen: {
    type: Boolean,
    required: true,
  },
  eventData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  "update:isDrawerOpen",
  "addEvent",
  "updateEvent",
  "removeEvent",
  "changes",
]);

const apiResponseStatus = ref("");
const apiResponseMessage = ref("");
const userData = JSON.parse(localStorage.getItem("userData") || "null");
const refInputEl = ref();
const startTimeCombined = ref("");
const endTimeCombined = ref("");

watchEffect(() => {
  if (props.eventData) {
    if (props.eventData.id) {
      console.log("<====There is prop===>", props.eventData);

      const startDate = props.eventData.start.toISOString().slice(0, 10);
      const startTime = props.eventData.start.toTimeString().slice(0, 5);

      startTimeCombined.value = `${startDate}T${startTime}`;

      const endDate = props.eventData.end
        ? props.eventData.end.toISOString().slice(0, 10)
        : ""; // Handle null case
      const endTime = props.eventData.end
        ? props.eventData.end.toTimeString().slice(0, 5)
        : ""; // Handle null case

      endTimeCombined.value = `${endDate}T${endTime}`;
    }
  } else {
    console.log("<====There is no prop===>");
  }
});

const form = ref({
  eventId: "",
  title: "",
  allDay: false,
  description: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  StartDateEdit: "",
  EndDateEdit: "",
  time: "",
  moderator: "",
  minister: "",
  guest: "",
  SGuest: "",
  Sermoner: "",
  location: "",
  type: "",
  parishCode: userData.parishcode || "",
  parishName: userData.parishname || "",
  eventImg: EventDefualt,
  eventImgFile: "",
});

watchEffect(() => {
  if (props.eventData && Object.keys(props.eventData).length > 0) {
    form.value.eventId = props.eventData.id || "";
    form.value.title = props.eventData.title || "";
    form.value.description = props.eventData.description || "";
    // eslint-disable-next-line vue/no-ref-as-operand
    form.value.startDate = startTimeCombined || "";
    // eslint-disable-next-line vue/no-ref-as-operand
    form.value.endDate = endTimeCombined || "";
    form.value.time = props.eventData.time || "";
    form.value.moderator = props.eventData.moderator || "";
    form.value.guest = props.eventData.guest || "";
    form.value.SGuest = props.eventData.guest || "";
    form.value.Sermoner = props.eventData.Sermoner || "";
    form.value.location = props.eventData.location || "";
    form.value.type = props.eventData.type || "";
  } else {
    form.value.eventId = "";
    form.value.title = "";
    form.value.description = "";
    form.value.startDate = "";
    form.value.endDate = "";
    form.value.time = "";
    form.value.moderator = "";
    form.value.guest = "";
    form.value.SGuest = "";
    form.value.Sermoner = "";
    form.value.location = "";
    form.value.type = "";
  }
});

const resetEventImg = () => {
  form.value.eventImg = EventDefualt;
};

const changeEventImg = (file) => {
  const { files } = file.target;
  if (files && files.length) {
    form.value.eventImgFile = files[0];

    const fileReader = new FileReader();

    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string")
        form.value.eventImg = fileReader.result;
    };
  }
};

const AddEvent = async () => {
  try {
    console.log(form.value);

    const formData = new FormData();

    formData.append("EventId", form.value.eventId);
    formData.append("Title", form.value.title);
    formData.append("Description", form.value.description);
    formData.append("startdate", form.value.StartDateEdit);
    formData.append("enddate", form.value.EndDateEdit);
    formData.append("start_time", form.value.startTime);
    formData.append("end_time", form.value.endTime);
    formData.append("Time", form.value.time);
    formData.append("Moderator", form.value.moderator);
    formData.append("Minister", form.value.minister);
    formData.append("guest", form.value.SGuest);
    formData.append("location", form.value.location);
    formData.append("Type", form.value.type);
    formData.append("parishcode", form.value.parishCode);
    formData.append("parishname", form.value.parishName);

    if (form.value.eventImg === EventDefualt) {
      const blob = await fetch(EventDefualt).then((res) => res.blob());

      formData.append("eventImg", blob, "avatar-7.png");
    } else {
      formData.append("eventImg", form.value.eventImgFile);
    }
    const response = ref({});

    if (form.value.eventId) {
      response.value = await api.post(
        `/updateEvent/${form.value.eventId}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      response.value = await api.post(`/AddEvent`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    console.log(
      "Event updated successfully",
      JSON.stringify(response.value.data)
    );

    const apiResponseDetails = response.value.data;

    apiResponseStatus.value = apiResponseDetails.status;
    apiResponseMessage.value = apiResponseDetails.message;
    if (apiResponseStatus.value === 200) {
      emit("changes"); // Emit the 'changes' event
    }
  } catch (error) {
    // Handle any errors
    console.error(
      "Error updating event:",
      error.response ? error.response.data : error.message
    );
  }
};

const onSubmit = (message) => {
  if (message) {
    AddEvent();
  }
};

const isConfirmDialogVisible = ref(false);
const store = useCalendarStore();
const refForm = ref();

// 👉 Event
const eventData = ref(JSON.parse(JSON.stringify(props.eventData)));

console.log("<===This is the prop event data===>", props.eventData);

watch([() => form.value.guest, () => form.value.Sermoner], () => {
  form.value.minister = `${form.value.guest || ""}${
    form.value.guest && form.value.Sermoner ? ", " : ""
  }${form.value.Sermoner || ""}`;
});

const onCancel = () => {
  console.log("Cancel clicked");
};

const startDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !form.value.allDay,
    dateFormat: `Y-m-d${form.value.allDay ? "" : " H:i"}`,
  };

  if (form.value.endDate) config.maxDate = form.value.endDate;

  return config;
});

const endDateTimePickerConfig = computed(() => {
  const config = {
    enableTime: !form.value.allDay,
    dateFormat: `Y-m-d${form.value.allDay ? "" : " H:i"}`,
  };

  if (form.value.startDate) config.minDate = form.value.startDate;

  return config;
});

watch([() => form.value.startDate, () => form.value.endDate], () => {
  if (form.value.startDate && form.value.endDate) {
    const start = new Date(form.value.startDate);
    const end = new Date(form.value.endDate);

    const formattedStartDate = start.toISOString().split("T")[0]; // Y-m-d format
    const formattedEndDate = end.toISOString().split("T")[0]; // Y-m-d format

    const formattedStartTime = start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const formattedEndTime = end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    form.value.StartDateEdit = formattedStartDate;
    form.value.EndDateEdit = formattedEndDate;
    form.value.startTime = formattedStartTime;
    form.value.endTime = formattedEndTime;

    const diffMs = end - start;
    const diffMonths =
      end.getMonth() -
      start.getMonth() +
      12 * (end.getFullYear() - start.getFullYear());

    let adjustedStart = new Date(start);
    adjustedStart.setMonth(start.getMonth() + diffMonths);
    let diffDays = Math.floor((end - adjustedStart) / (1000 * 60 * 60 * 24));
    adjustedStart.setDate(adjustedStart.getDate() + diffDays);

    const diffHrs = Math.floor((end - adjustedStart) / 3600000);
    const diffMins = Math.floor(((end - adjustedStart) % 3600000) / 60000);

    const timeParts = [];
    if (diffMonths > 0) timeParts.push(`${diffMonths} month(s)`);
    if (diffDays > 0) timeParts.push(`${diffDays} day(s)`);
    if (diffHrs > 0) timeParts.push(`${diffHrs} hour(s)`);
    if (diffMins > 0 || timeParts.length === 0)
      timeParts.push(`${diffMins} minute(s)`);

    form.value.time = timeParts.join(", ");
  } else {
    form.value.time = "";
  }
});

const dialogModelValueUpdate = (val) => {
  emit("update:isDrawerOpen", val);
};
</script>

<template>
  <VNavigationDrawer
    temporary
    location="end"
    :model-value="props.isDrawerOpen"
    width="420"
    class="scrollable-content"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      :title="form.eventId ? 'Update Event' : 'Add Event'"
      @cancel="$emit('update:isDrawerOpen', false)"
    >
      <template #beforeClose>
        <IconBtn v-show="form.eventId">
          <VIcon size="18" icon="tabler-trash" />
        </IconBtn>
      </template>
    </AppDrawerHeaderSection>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <!-- SECTION Form -->
          <VCardText class="d-flex">
            <!-- 👉 Avatar -->
            <VAvatar rounded size="100" class="me-6" :image="form.eventImg" />

            <!-- 👉 Upload Photo -->
            <form class="d-flex flex-column justify-center gap-4">
              <div class="d-flex flex-wrap gap-2">
                <VBtn color="primary" @click="refInputEl?.click()">
                  <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block">Upload Event Image</span>
                </VBtn>

                <input
                  ref="refInputEl"
                  type="file"
                  name="file"
                  accept=".jpeg,.png,.jpg,GIF"
                  hidden
                  @input="changeEventImg"
                />

                <VBtn
                  type="reset"
                  color="secondary"
                  variant="tonal"
                  @click="resetEventImg"
                >
                  <span class="d-none d-sm-block">Reset</span>
                  <VIcon icon="tabler-refresh" class="d-sm-none" />
                </VBtn>
              </div>

              <p class="text-body-1 mb-0">
                Allowed JPG, GIF or PNG. Max size of 800K
              </p>
            </form>
          </VCardText>

          <VDivider class="mb-4" />
          <VRow>
            <!-- 👉 Title -->
            <VCol cols="12">
              <AppTextField
                v-model="form.title"
                label="Title"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- 👉 Title -->
            <VCol cols="12">
              <AppTextField
                v-model="form.type"
                label="Type"
                :rules="[requiredValidator]"
              />
            </VCol>

            <VCol cols="12">
              <AppDateTimePicker
                v-model="form.startDate"
                :rules="[requiredValidator]"
                label="Start Date"
                :config="startDateTimePickerConfig"
              />
            </VCol>

            <!-- End Date -->
            <VCol cols="12">
              <AppDateTimePicker
                v-model="form.endDate"
                :rules="[requiredValidator]"
                label="End Date"
                :config="endDateTimePickerConfig"
              />
            </VCol>

            <!-- Time Difference -->
            <VCol cols="12">
              <AppTextField
                v-model="form.time"
                label="Event Duration"
                readonly
              />
            </VCol>

            <!-- 👉 All day -->
            <VCol cols="12">
              <VSwitch v-model="form.allDay" label="All day" />
            </VCol>

            <VCol cols="12">
              <AppTextField
                v-model="form.moderator"
                label="Coordinator/Service conductor"
                :rules="[requiredValidator]"
              />
            </VCol>
            <!-- 👉 Guests -->
            <VCol cols="12">
              <AppTextField v-model="form.SGuest" label="Guests Minister" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="form.Sermoner" label="Sermoner" />
            </VCol>
            <VCol cols="12">
              <AppTextField v-model="form.guest" label="Guests" />
            </VCol>

            <!-- 👉 Location -->
            <VCol cols="12">
              <AppTextField v-model="form.location" label="Event Location" />
            </VCol>

            <!-- 👉 Description -->
            <VCol cols="12">
              <AppTextarea v-model="form.description" label="Description" />
            </VCol>

            <!-- 👉 Form buttons -->
            <VCol cols="12">
              <VBtn
                type="submit"
                class="me-3"
                @click="isConfirmDialogVisible = true"
              >
                Submit
              </VBtn>
            </VCol>
          </VRow>
          <!-- !SECTION -->
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to confirm this registration Did you want to continue ?"
    cancel-msg="Event Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Registration Successfully!"
    @confirm="onSubmit"
    @cancel="onCancel"
  />
</template>
