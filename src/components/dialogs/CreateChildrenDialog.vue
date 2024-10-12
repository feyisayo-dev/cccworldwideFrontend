<!-- eslint-disable vue/no-setup-props-destructure -->
<script setup>
import { useAllAdminActions } from "@/apiservices/adminActions";
import api from "@/apiservices/api";
import { onMounted, ref } from "vue";
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const isPasswordValid = computed(() => form.value.password.length >= 6)
const doPasswordsMatch = computed(() => form.value.password === form.value.confirmPassword)

const props = defineProps({
  MemberChildrenData: {
    type: Object,
    required: true,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isDialogVisible", "updatedData", "changes"]);

// const titleName = ref([])
const currentStep = ref(0);
const apiResponseStatus = ref("");
const apiResponseMessage = ref("");
const userData = JSON.parse(localStorage.getItem("userData") || "null");
const allAdminActions = useAllAdminActions();

console.log("<=======This is the UserId=========>", userData.parishcode);
console.log("<=======This is the UserId=========>", userData.parishname);

const form = ref({
  MemberName: userData.fname || "",
  children: [
    {
      email: "",
      password: "",
      confirmPassword: "",
      sname: "",
      fname: "",
      mname: "",
      Gender: "",
      dob: "",
    },
  ],
  genderList: ["Male", "Female", "Other"], // Options for gender select dropdown
  edit: false,
});

const createApp = [
  {
    icon: "tabler-clipboard",
    title: "Create Children Details",
    subtitle: "Enter Details",
  },
];

watchEffect(() => {});

const addChild = () => {
  form.value.children.push({
    email: "",
    password: "",
    confirmPassword: "",
    sname: "",
    fname: "",
    mname: "",
    Gender: "",
    dob: "",
  });
};
const removeChildren = (index) => {
  if (form.value.children.length > 1) {
    form.value.children.splice(index, 1);
  }
};

const dialogVisibleUpdate = (val) => {
  emit("update:isDialogVisible", val);
  currentStep.value = 0;
};

watch(props, () => {
  if (!props.isDialogVisible) currentStep.value = 0;
});

const onSubmit = async (message) => {
  if (message) {
    try {
      const formData = new FormData();
      formData.append(`ParentId`, userData.UserId);
      // Add form data for each child
      form.value.children.forEach((child, index) => {
        formData.append(`children[${index}][email]`, child.email);
        formData.append(`children[${index}][password]`, child.password);
        formData.append(`children[${index}][confirmPassword]`, child.confirmPassword);
        formData.append(`children[${index}][sname]`, child.sname);
        formData.append(`children[${index}][fname]`, child.fname);
        formData.append(`children[${index}][mname]`, child.mname);
        formData.append(`children[${index}][Gender]`, child.Gender);
        formData.append(`children[${index}][dob]`, child.dob);
      });

      console.log([...formData]);  // Debugging to check the FormData content

      let response = ref[""];
      if (props.MemberChildrenData?.children) {
        response = await api.post(`/children/{id}/update`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.post("/Addchildren", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const apiResponseDetails = response.data;

      console.log("<===This is the details===>", apiResponseDetails);
      apiResponseStatus.value = apiResponseDetails.status;
      apiResponseMessage.value = apiResponseDetails.message;

      if (apiResponseStatus.value === 200) {
        emit("changes");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      isConfirmDialogVisible.value = false;
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
        <h5 class="text-h5 text-center mb-2">
          {{ form.edit ? "Update Children" : "Create New Children Details" }}
        </h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create a new committee.
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
              <!-- 👉 committee  -->
              <VWindowItem>
                <VRow>
                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="form.MemberName"
                      label="Member First Name"
                      variant="outlined"
                      readonly
                    />
                  </VCol>
                </VRow>
                <VRow v-for="(child, index) in form.children" :key="index">
                  <VRow>
                    <VCol cols="12">
                      <VTextField
                        v-model="child.email"
                        label="Enter Email Address"
                        variant="outlined"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="child.password"
                        label="Enter Password"
                        variant="outlined"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        :append-inner-icon="
                          isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                        "
                        hint="Password must be at least 6 characters long"
                        persistent-hint
                        @click:append-inner="
                          isPasswordVisible = !isPasswordVisible
                        "
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="child.confirmPassword"
                        label="Confirm Password"
                        variant="outlined"
                        :type="isConfirmPasswordVisible ? 'text' : 'password'"
                        :append-inner-icon="
                          isConfirmPasswordVisible
                            ? 'tabler-eye-off'
                            : 'tabler-eye'
                        "
                        hint="Make sure your passwords match"
                        persistent-hint
                        @click:append-inner="
                          isConfirmPasswordVisible = !isConfirmPasswordVisible
                        "
                      />
                    </VCol>
                  </VRow>

                  <VRow>
                    <VCol cols="12">
                      <VTextField
                        v-model="child.sname"
                        label="Enter Surname"
                        variant="outlined"
                        :rules="[(v) => !!v || 'Surname is required']"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="child.fname"
                        label="Enter First Name"
                        variant="outlined"
                        :rules="[(v) => !!v || 'First Name is required']"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VTextField
                        v-model="child.mname"
                        label="Enter Middle Name"
                        variant="outlined"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <VSelect
                        v-model="child.Gender"
                        :items="form.genderList"
                        label="Select your gender"
                        outlined
                        :rules="[(v) => !!v || 'Gender is required']"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="child.dob"
                        type="date"
                        label="DOB"
                        :rules="[(v) => !!v || 'Date of Birth is required']"
                        hint="Your year of birth is not shown to anyone"
                        persistent-hint
                      />
                    </VCol>
                  </VRow>

                  <VCol cols="2">
                    <VBtn icon @click="removeChildren(index)">
                      <VIcon icon="tabler-minus" size="16" />
                    </VBtn>
                  </VCol>
                </VRow>

                <!-- Button to add new child -->
                <VRow>
                  <VCol cols="12">
                    <VBtn icon @click="addChildren">
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
    confirmation-question="You are about to confirm this Child Details, do you want to continue ?"
    cancel-msg="Registration Cancelled!!"
    cancel-title="Cancelled"
    :confirm-msg="apiResponseMessage"
    confirm-title="Successful!"
    @confirm="onSubmit"
    @cancel="onCancel"
  />
</template>

<style lang="scss">
.stepper-content .card-list {
  --v-card-list-gap: 24px;
}
</style>
