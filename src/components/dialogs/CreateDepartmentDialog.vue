<script setup>
import { useAllAdminActions } from "@/apiservices/adminActions";
import api from "@/apiservices/api";
import { onMounted, ref } from "vue";
import DeptDefualt from "@images/avatars/ccclogo.png";
const refInputEl = ref();

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isDialogVisible", "changes", "updatedData"]);

const AllAdminActions = useAllAdminActions();

// const titleName = ref([])
const currentStep = ref(0);
const apiResponseStatus = ref("");
const apiResponseMessage = ref("");
const userData = JSON.parse(localStorage.getItem("userData") || "null");

const form = ref({
  parishcode: "" || userData.parishcode,
  parishname: "" || userData.parishname,
  logo: "",
  name: "",
  date: "",
  leader: "",
  team: "",
  status: "Not Approved",
  teamMembers: [""],
  members: [""],
  DeptImgFile: "",
  DeptImg: DeptDefualt,
});

const dialogVisibleUpdate = (val) => {
  emit("update:isDialogVisible", val);
  currentStep.value = 0;
};

const addTeamMembers = () => {
  form.value.teamMembers.push("");
};
const resetDeptImg = () => {
  form.value.DeptImg = DeptDefualt;
};

const changeDeptImg = (file) => {
  const { files } = file.target;
  if (files && files.length) {
    form.value.DeptImgFile = files[0];

    const fileReader = new FileReader();

    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string")
        form.value.DeptImg = fileReader.result;
    };
  }
};

const removeTeamMembers = (index) => {
  if (form.value.teamMembers.length > 1) {
    form.value.teamMembers.splice(index, 1);
  }
};

const fetchMembersbyParish = (message) => {
  if (message) {
    try {
      api
        .get(`/Fetchmemberbyparish/${userData.parishcode}`)
        .then((response) => {
          // Ensure response.data.records is correctly set
          form.value.members = response.data.records.map((member) => ({
            ...member,
            MemberName: `${member.fname} ${
              member.mname ? member.mname + " " : ""
            }${member.sname}`,
          }));
          console.log("This is the member", form.value.members);

          // Filter and map the members to separate males and females
          form.value.Malemembers = form.value.members
            .filter((member) => member.Gender === "Male")
            .map((member) => ({
              ...member,
              fullName: `${member.fname} ${
                member.mname ? member.mname + " " : ""
              }${member.sname}`,
            }));

          form.value.Femalemembers = form.value.members
            .filter((member) => member.Gender === "Female")
            .map((member) => ({
              ...member,
              fullName: `${member.fname} ${
                member.mname ? member.mname + " " : ""
              }${member.sname}`,
            }));

          console.log(
            "This is the separation by gender",
            "Male:",
            form.value.Malemembers,
            "Female:",
            form.value.Femalemembers
          );
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  }
};

watchEffect(fetchMembersbyParish);

watch(props, () => {
  if (!props.isDialogVisible) currentStep.value = 0;
});

const onSubmit = async (message) => {
  if (message) {
    try {
      const parishCode = userData.parishcode || "default_parish_code";
      const formData = new FormData();

      formData.append("parishcode", form.value.parishcode);
      formData.append("name", form.value.name);
      formData.append("date", form.value.date);
      formData.append("leader", form.value.leader);
      formData.append("team", form.value.teamMembers.join(",")); // Make sure teamMembers is an array
      formData.append("status", form.value.status);

      // Handling image file
      if (form.value.DeptImg === DeptDefualt) {
        const blob = await fetch(DeptDefualt).then((res) => res.blob());
        formData.append("logo", blob, "avatar-7.png");
      } else {
        formData.append("logo", form.value.DeptImgFile); // Make sure DeptImgFile is a valid file object
      }

      // Submit form data to API
      api
        .post(`/AddDepartment/${parishCode}`, formData)
        .then((response) => {
          const apiResponseDetails = response.data;

          // Update response status and message
          apiResponseStatus.value = apiResponseDetails.status;
          apiResponseMessage.value = apiResponseDetails.message;

          if (apiResponseStatus.value === 200) {
            emit("changes"); // Emit changes event if successful
          } else {
            // Optionally handle other status codes
            console.warn(`Unexpected status code: ${apiResponseStatus.value}`);
          }
        })
        .catch((error) => {
          console.error("Error submitting data:", error); // Log any error
        })
        .finally(() => {
          isConfirmDialogVisible.value = false; // Close the dialog
          // Any other cleanup code
        });
    } catch (error) {
      console.error("Error:", error); // Handle error
    }
  }
};

const isConfirmDialogVisible = ref(false);
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="950"
    @update:model-value="dialogVisibleUpdate"
  >
    <!-- 👉 dialog close btn -->
    <DialogCloseBtn
      size="small"
      @click="emit('update:isDialogVisible', false)"
    />
    <VCard class="create-app-dialog">
      <VCardText class="pa-5 pa-sm-10">
        <h5 class="text-h5 text-center mb-2">Add new Daprtment</h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create a new Daprtment.
        </p>

        <VRow>
          <VCol cols="6" sm="3">
            <AppStepper
              v-model:current-step="currentStep"
              direction="vertical"
              :items="createApp"
              icon-size="24"
              class="stepper-icon-step-bg"
            />
          </VCol>

          <VCol cols="18" sm="7" md="8" lg="9">
            <VWindow
              v-model="currentStep"
              class="disable-tab-transition stepper-content"
            >
              <VWindowItem>
                <VRow>
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="form.parishname"
                      label="Your parish name"
                      variant="outlined"
                      readonly
                    />
                  </VCol>
                  <VCardText class="d-flex">
                    <!-- 👉 Avatar -->
                    <VAvatar
                      rounded
                      size="100"
                      class="me-6"
                      :image="form.DeptImg"
                    />

                    <!-- 👉 Upload Photo -->
                    <form class="d-flex flex-column justify-center gap-4">
                      <div class="d-flex flex-wrap gap-2">
                        <VBtn color="primary" @click="refInputEl?.click()">
                          <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                          <span class="d-none d-sm-block"
                            >Upload Event Image</span
                          >
                        </VBtn>

                        <input
                          ref="refInputEl"
                          type="file"
                          name="file"
                          accept=".jpeg,.png,.jpg,GIF"
                          hidden
                          @input="changeDeptImg"
                        />

                        <VBtn
                          type="reset"
                          color="secondary"
                          variant="tonal"
                          @click="resetDeptImg"
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
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="form.name"
                      label="Enter name name"
                      variant="outlined"
                    />
                  </VCol>
                </VRow>
                <VRow>
                  <VCol cols="12" md="6">
                    <VAutocomplete
                      v-model="form.leader"
                      :items="form.members"
                      label=" Select member to lead department"
                      variant="outlined"
                      item-title="MemberName"
                      item-value="MemberName"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="form.date"
                      label="Pick date the department was inagurated"
                      variant="outlined"
                      type="date"
                    />
                  </VCol>
                </VRow>
                <VRow
                  v-for="(teamMember, index) in form.teamMembers"
                  :key="index"
                >
                  <VCol cols="10" md="4">
                    <VAutocomplete
                      v-model="form.teamMembers[index]"
                      :items="form.members"
                      :label="`team member ${index + 1}`"
                      variant="outlined"
                      item-title="MemberName"
                      item-value="UserId"
                      clearable
                      outlined
                    />
                  </VCol>
                  <VCol cols="2">
                    <VBtn icon @click="removeTeamMembers(index)">
                      <VIcon icon="tabler-minus" size="16" />
                    </VBtn>
                  </VCol>
                </VRow>

                <VRow>
                  <VCol cols="12">
                    <VBtn icon @click="addTeamMembers">
                      <VIcon icon="tabler-plus" size="16" />
                    </VBtn>
                  </VCol>
                </VRow>
              </VWindowItem>
              <div class="d-flex justify-space-between mt-8">
                <VBtn color="success" @click="isConfirmDialogVisible = true">
                  submit
                  <VIcon icon="tabler-check" end class="flip-in-rtl" />
                </VBtn>
              </div>
            </VWindow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to confirm this Department Did you want to continue ?"
    cancel-msg="Registration Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Registered!"
    @confirm="onSubmit"
    @cancel="onCancel"
  />
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 24px;
}
</style>
