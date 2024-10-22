<!-- eslint-disable vue/no-lone-template -->
<script setup>
import { useAllAdminActions } from "@/apiservices/adminActions";
import api from "@/apiservices/api";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import {
  default as registerMultistepIllustrationDark,
  default as registerMultistepIllustrationLight,
} from "@images/illustrations/ccclogo.png";
import registerMultistepBgDark from "@images/pages/register-multistep-bg-dark.png";
import registerMultistepBgLight from "@images/pages/register-multistep-bg-light.png";
import { onMounted, ref } from "vue";

const registerMultistepBg = useGenerateImageVariant(
  registerMultistepBgLight,
  registerMultistepBgDark
);
const currentStep = ref(0);
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const registerMultistepIllustration = useGenerateImageVariant(
  registerMultistepIllustrationLight,
  registerMultistepIllustrationDark
);
const allAdminActions = useAllAdminActions();
const apiResponseStatus = ref("");
const apiResponseMessage = ref("");

const items = [
  {
    title: "Account",
    subtitle: "Account Details",
    icon: "tabler-smart-home",
  },
  {
    title: "Personal Details",
    subtitle: "Personal Information",
    icon: "tabler-users",
  },
  {
    title: "Anointing Details",
    subtitle: "Joinning/Anoiting Details",
    icon: "tabler-credit-card",
  },
  {
    title: "Contact Details",
    subtitle: "Contact Details",
    icon: "tabler-map-pin",
  },
  {
    title: "Church Details",
    subtitle: "Church Information",
    icon: "custom-home",
  },
  {
    title: "Review and Summary",
    subtitle: "Review & Summary",
    icon: "tabler-file-text",
  },
];

const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
  sname: " ",
  fname: "",
  mname: "",
  Gender: "Select you gender",
  dob: "",
  MStatus: "Select status",
  VineyardStatus: "Select Vineyard status",
  title: "Select present title",
  filteredTitleList: "Select present title",
  dot: "",
  selectedMinistry: "Select Ministry",
  phoneNo: "",
  altPhoneno: "",
  address: "",
  selectedCountry: "",
  residentialCountry: "",
  churchCountryName: "",
  selectedState: "",
  selectedchurchCountry: " ",
  selectedChurchState: "Select state",
  state: "",
  city: "",
  Country: "",
  selectedParish: "Select parish",
  getTitleByGendervalue: "",
  selectedParishState: "Select state",
  getParisByState: "",
  userParish: "",
  userParishCode: "",
  confirm_title: "Registered!",
  getCountryById: "",
  getChurchCountryById: "",

  // Add other form fields as needed list here confirm-title
  ministryList: [],
  countryList: [],
  stateList: [],
  churchStateList: [],
  titleList: [],
  parishList: [],
  genderList: Object.freeze(["Male", "Female"]),
});

//Fetch all country
const fetchCountries = async () => {
  const cachedCountries = localStorage.getItem("countries");

  if (cachedCountries) {
    // If the data exists, load it from localStorage
    console.log(
      "Loaded countries from localStorage",
      JSON.parse(cachedCountries)
    );

    form.value.countryList = JSON.parse(cachedCountries).map((country) => ({
      id: country.id,
      name: country.name,
      flag_img: country.flag_img,
      states: country.states,
    }));
  } else {
    // If not available, fetch from API and store in localStorage
    allAdminActions
      .fetchCountries()
      .then((response) => {
        const data = response.data;
        console.log("This is my data", data);

        if (data.countries && data.countries.length > 0) {
          // Store fetched countries in localStorage
          localStorage.setItem("countries", JSON.stringify(data.countries));

          form.value.countryList = data.countries.map((country) => ({
            id: country.id,
            name: country.name,
            flag_img: country.flag_img,
            states: country.states,
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }
};

//Fetch Ministry
const fetchMinistryFromApi = async () => {
  allAdminActions
    .fetchMinistryFromApi({})
    .then((response) => {
      const data = response.data;

      form.value.ministry = data.ministry;

      if (data.ministry && data.ministry.length > 0) {
        form.value.ministryList = data.ministry.map(
          (ministry) => ministry.ministry
        );
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const register = async () => {
  try {
    // Determine the value for Status based on MStatus
    const status =
      form.value.MStatus === "Vineyard Worker"
        ? form.value.VineyardStatus
        : null;

    // Make the API request
    const response = await api.post("/Addmember", {
      email: form.value.email,
      password: form.value.password,
      sname: form.value.sname,
      fname: form.value.fname,
      mname: form.value.mname,
      Gender: form.value.Gender,
      dob: form.value.dob,
      MStatus: form.value.MStatus,
      Status: status,
      Title: form.value.title,
      dot: form.value.dot,
      ministry: form.value.selectedMinistry,
      mobile: form.value.phoneNo,
      Altmobile: form.value.altPhoneno,
      address: form.value.address,
      Country: form.value.residentialCountry,
      State: form.value.selectedState,
      City: form.value.city,
      parishcode: form.value.userParishCode,
      parishname: form.value.userParish,
    });

    // Handle the response
    console.log("Got usersData here register", JSON.stringify(response.data));

    const apiResponseDetails = response.data;

    // Perform necessary actions with the response data
    apiResponseStatus.value = apiResponseDetails.status;
    apiResponseMessage.value = apiResponseDetails.message;

    // Check status and reload if successful
    if (apiResponseStatus.value === 200) {
      window.location.href = "/login";
    }
  } catch (error) {
    // Handle any errors
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  } finally {
    // Close the confirmation dialog and perform any cleanup
    isConfirmDialogVisible.value = false;
  }
};

const onCountryChange = () => {
  form.value.selectedParishState = "";
  form.value.selectedParish = "";
  form.value.churchStateList = [];
  form.value.parishList = [];

  getChurchState();
};

// 👉 FetchAll parish from state
const fetchParishes = async (state) => {
  if (state) {
    try {
      form.value.parishList = [];
      form.value.selectedParish = ""; // Clear the selected parish
      console.log("<=====This is the state of the church======>", state);

      const response = await allAdminActions.fetchStateParish(state);

      const data = response.data;
      if (data.Allparish && data.Allparish.length > 0) {
        form.value.parishList = data.Allparish.map((parish) => ({
          parishname: `${parish.parishname} ${parish.address}`,
          country: parish.country,
          states: parish.states,
          city: parish.city,
          parishaddress: parish.address,
          name: parish.parishname,
          parishcode: parish.parishcode,
        }));
      }
      console.log("<=====This is the response======>", form.value.parishList);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  }
};

const getTitleByGender = async (getByGendervalue) => {
  try {
    const response = await api.get(`/getTitleByGender/${getByGendervalue}`);
    console.log(
      "this is the title that was fetched by gender",
      getByGendervalue
    );
    const data = response.data.titles;

    if (data && data.length > 0) {
      form.value.titleList = data.map((genderTitles) => ({
        level: genderTitles.level,
        title: genderTitles.title,
        status: genderTitles.status,
      }));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

onMounted(() => {
  fetchMinistryFromApi();
  fetchCountries();
});

const getResidentialState = () => {
  console.log(
    "<=========This is the country id picked for residential==========>",
    form.value.selectedCountry
  );

  if (form.value.selectedCountry) {
    form.value.getCountryById = form.value.countryList.find(
      (country) => country.id === form.value.selectedCountry
    );

    if (form.value.getCountryById) {
      console.log(
        "<=========This is the country picked for residential==========>",
        form.value.getCountryById
      );
      form.value.residentialCountry = form.value.getCountryById.name;
    } else {
      console.error("No country found for the selected country ID.");
    }
  }

  if (
    form.value.getCountryById &&
    Array.isArray(form.value.getCountryById.states) &&
    form.value.getCountryById.states.length > 0
  ) {
    try {
      const data = form.value.getCountryById.states;

      if (Array.isArray(data) && data.length > 0) {
        form.value.stateList = data.map((countryState) => ({
          country_id: countryState.country_id,
          name: countryState.name,
        }));
      }
    } catch (error) {}
  }
};

const getChurchState = () => {
  if (form.value.selectedchurchCountry) {
    console.log(
      "<=========This is the country ID picked for parish==========>",
      form.value.selectedchurchCountry
    );

    form.value.getChurchCountryById = form.value.countryList.find(
      (country) => country.id === form.value.selectedchurchCountry
    );

    console.log(
      "<=========This is the country picked for parish==========>",
      form.value.getChurchCountryById
    );
    form.value.churchCountryName = form.value.getChurchCountryById.name;
    form.value.churchStateList = [];
    form.value.selectedParishState = "";

    if (
      form.value.getChurchCountryById &&
      Array.isArray(form.value.getChurchCountryById.states) &&
      form.value.getChurchCountryById.states.length > 0
    ) {
      try {
        const data = form.value.getChurchCountryById.states;
        console.log(data);

        if (Array.isArray(data) && data.length > 0) {
          form.value.churchStateList = data.map((churchState) => ({
            country_id: churchState.country_id,
            name: churchState.name,
          }));
        }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    }
  }
};

const getGenderTitle = () => {
  if (form.value.Gender) {
    const gender = form.value.Gender;

    getTitleByGender(gender);
  }
};
const filterTitleByStatus = () => {
  console.log("Trying to filter");
  if (form.value.MStatus) {
    const selectedStatus = form.value.MStatus.trim().toLowerCase();
    console.log("Selected status:", selectedStatus);

    // Log titleList before filtering
    console.log("Title list before filtering:", form.value.titleList);
    form.value.titleList.forEach((title) => {
      console.log("Title object:", title.status);
    });
    // Perform the filtering
    form.value.filteredTitleList = form.value.titleList.filter(
      (title) =>
        title.status && title.status.toLowerCase().trim() === selectedStatus
    );

    console.log("This is the filtered:", form.value.filteredTitleList);
  } else {
    console.log("Failed to filter");
  }
};

const getStateParish = () => {
  if (form.value.selectedParishState) {
    console.log(
      "<=========This is the state picked for parish==========>",
      form.value.selectedParishState
    );
    fetchParishes(form.value.selectedParishState);
  } else {
    console.log("No state is selected");
  }
};

const onSubmit = (message) => {
  if (message) {
    register();
  }
};

watch(
  () => form.value.selectedParish,
  (newValue) => {
    if (newValue) {
      const selectedParishObject = form.value.parishList.find(
        (parish) => parish.parishcode === newValue
      );

      if (selectedParishObject) {
        console.log("Selected Parish Name:", selectedParishObject.parishname);
        form.value.userParish = selectedParishObject.parishname;
        form.value.userParishCode = newValue;
      } else {
        console.log("Parish not found");
      }
    }
  }
);

watch(
  () => form.value.Gender,
  (newGender) => {
    if (newGender) {
      getGenderTitle(newGender);
    }
  }
);
watch(
  () => form.value.MStatus,
  (newStatus) => {
    if (newStatus) {
      filterTitleByStatus(newStatus);
    }
  }
);

const isConfirmDialogVisible = ref(false);

const refetchData = (hideOverlay) => {
  setTimeout(hideOverlay, 3000);
};

const isPasswordValid = computed(() => form.value.password.length >= 6);
const doPasswordsMatch = computed(
  () => form.value.password === form.value.confirmPassword
);

const isNextButtonDisabled = computed(() => {
  return (
    currentStep.value === 0 &&
    (!isPasswordValid.value || !doPasswordsMatch.value)
  );
});

const isStep1Valid = computed(() => {
  return (
    form.value.sname && form.value.fname && form.value.Gender && form.value.dob
  );
});
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol md="1" class="d-none d-md-flex">
      <div class="d-flex justify-center align-center w-100 position-relative">
        <router-link to="/landing">
          <p class="mb-0">Go home &rarr;</p>
        </router-link>
      </div>
    </VCol>

    <VCol
      cols="30"
      md="12"
      class="auth-card-v2 d-flex align-center justify-center pa-10"
      style="background-color: rgb(var(--v-theme-surface))"
    >
      <VCard flat class="mt-16 mt-sm-0">
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          icon-size="45"
          class="stepper-icon-step-bg mb-10"
        />
        <VDivider />
        <VCardText>
          <VForm>
            <VWindow v-model="currentStep" class="disable-tab-transition">
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h4 mb-1">Account Information</h5>
                    <p class="text-sm">Enter Your Account Details</p>
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="form.email"
                      label="Enter Email Address"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="form.password"
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
                      v-model="form.confirmPassword"
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
              </VWindowItem>

              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h5 mb-1">Personal Information</h5>
                    <p class="text-sm">Enter Your Personal Information</p>
                  </VCol>

                  <VCol cols="12">
                    <VTextField
                      v-model="form.sname"
                      label="Enter Surname"
                      variant="outlined"
                      :rules="[(v) => !!v || 'Surname is required']"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="form.fname"
                      label="Enter First Name"
                      variant="outlined"
                      :rules="[(v) => !!v || 'First Name is required']"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VTextField
                      v-model="form.mname"
                      label="Enter Middle Name"
                      variant="outlined"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VSelect
                      v-model="form.Gender"
                      :items="form.genderList"
                      label="Select your gender"
                      outlined
                      :rules="[(v) => !!v || 'Gender is required']"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="form.dob"
                      type="date"
                      label="DOB"
                      :rules="[(v) => !!v || 'Date of Birth is required']"
                      hint="Your year of birth is not shown to anyone"
                      persistent-hint
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h5 mb-1">Joinning/Anoiting Information</h5>
                    <p class="text-sm">Enter Your Joinning/Anoiting</p>
                  </VCol>

                  <VCol cols="12" md="6">
                    <AppSelect
                      v-model="form.MStatus"
                      label="Member Status"
                      placeholder=" Select status "
                      :items="['Member/Laity', 'Vineyard Worker']"
                    />
                  </VCol>

                  <VCol
                    v-if="form.MStatus == 'Vineyard Worker'"
                    cols="12"
                    md="6"
                  >
                    <AppSelect
                      v-model="form.VineyardStatus"
                      label="Vineyard Status"
                      placeholder=" Select Vineyard status "
                      :items="[
                        'Shepherd',
                        'Asst. Shepherd',
                        'Wolider',
                        'Wolima',
                        'Church Worker',
                        'Pastor',
                      ]"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <AppSelect
                      v-model="form.title"
                      label="Present Title"
                      :items="form.filteredTitleList"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="form.dot"
                      type="date"
                      label="Date of present Anoitment"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppSelect
                      id="ministrySelect"
                      v-model="form.selectedMinistry"
                      label="Ministry"
                      :items="form.ministryList"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
              <VWindowItem>
                <VRow>
                  <VCol cols="12">
                    <h5 class="text-h5 mb-1">Contact Information</h5>
                    <p class="text-sm">Enter Your contact details</p>
                  </VCol>

                  <VCol cols="12" md="6">
                    <VPhoneInput
                      v-model="form.phoneNo"
                      label="WhatsApp Phone number"
                      country-label="Country"
                      country-aria-label="Country for phone number"
                      default-country="NG"
                      invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VPhoneInput
                      v-model="form.altPhoneno"
                      label="Alternative Phone number"
                      country-label="Country"
                      country-aria-label="Country for phone number"
                      default-country="NG"
                      invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                    />
                  </VCol>

                  <VCol cols="12">
                    <AppTextField
                      v-model="form.address"
                      label="Residential Address"
                      placeholder="Residential Address Street number and name"
                    />
                  </VCol>

                  <VCol cols="12" md="6">
                    <VAutocomplete
                      v-model="form.selectedCountry"
                      label="Country of residence"
                      :items="form.countryList"
                      item-title="name"
                      item-value="id"
                      density="compact"
                      variant="outlined"
                      @change="getResidentialState"
                    >
                      <template #item="{ props: listItemProp, item }">
                        <VListItem v-bind="listItemProp">
                          <template #prepend>
                            <VAvatar :image="item.raw.flag_img" size="30" />
                          </template>
                        </VListItem>
                      </template>
                    </VAutocomplete>
                  </VCol>
                  <VCol cols="12" md="6">
                    <VAutocomplete
                      v-model="form.selectedState"
                      label="State of residence"
                      :items="form.stateList"
                      item-title="name"
                    />
                  </VCol>
                  <VCol cols="12" md="6">
                    <AppTextField
                      v-model="form.city"
                      label="City"
                      placeholder="Enter your Residenctial City"
                    />
                  </VCol>
                </VRow>
              </VWindowItem>
              <VWindowItem>
                <h5 class="text-h5 mt-10">Church Information</h5>
                <p class="text-sm">Enter your current church information</p>
                <VRow>
                  <VCol cols="12">
                    <VAutocomplete
                      v-model="form.selectedchurchCountry"
                      label="Country"
                      :items="form.countryList"
                      item-title="name"
                      item-value="id"
                      density="compact"
                      variant="outlined"
                      @change="onCountryChange"
                    >
                      <template #item="{ props: listItemProp, item }">
                        <VListItem v-bind="listItemProp">
                          <template #prepend>
                            <VAvatar :image="item.raw.flag_img" size="30" />
                          </template>
                        </VListItem>
                      </template>
                    </VAutocomplete>
                  </VCol>

                  <VCol cols="6" md="6">
                    <VAutocomplete
                      v-model="form.selectedParishState"
                      label="State"
                      :items="form.churchStateList"
                      item-title="name"
                      placeholder="Select state"
                      @change="getStateParish"
                    />
                  </VCol>

                  <VCol cols="6" md="6">
                    <VAutocomplete
                      v-model="form.selectedParish"
                      label="Parish"
                      :items="form.parishList"
                      item-value="parishcode"
                      :item-title="(item) => item.parishname || 'Select Parish'"
                      :hint="`${form.selectedParish}`"
                      persistent-hint
                      double-line
                    />
                  </VCol>
                </VRow>
              </VWindowItem>

              <VWindowItem>
                <div class="text-base">
                  <h6 class="text-base font-weight-medium mb-2">
                    Review & Summary
                  </h6>

                  <p class="mb-1">Email address {{ form.email }}</p>

                  <VDivider class="my-4" />

                  <h6 class="text-base font-weight-medium mb-2">
                    Personal Details
                  </h6>

                  <p class="mb-1 text-base">
                    Surname Name <span>{{ form.sname }}</span>
                  </p>
                  <p class="mb-1 text-base">First Name {{ form.fname }}</p>
                  <p class="mb-1 text-base">Middle Name {{ form.mname }}</p>
                  <p class="mb-1">Gender {{ form.Gender }}</p>
                  <p class="mb-1">DOB {{ form.dob }}</p>

                  <VDivider class="my-4" />

                  <h6 class="text-base font-weight-medium mb-2">
                    Joinning/Anoiting Details
                  </h6>

                  <p class="mb-1">Member Status {{ form.MStatus }}</p>
                  <p v-if="form.MStatus == 'Vineyard Worker'" class="mb-1">
                    Vineyard Status {{ form.VineyardStatus }}
                  </p>
                  <p class="mb-1">Present Title {{ form.title }}</p>
                  <p class="mb-1">Date of present Anoitment {{ form.dot }}</p>
                  <p class="mb-1">Ministry {{ form.selectedMinistry }}</p>

                  <VDivider class="my-4" />

                  <h6 class="text-base font-weight-medium mb-2">
                    Contact Details
                  </h6>

                  <p class="mb-1">WhatsApp Phone number {{ form.phoneNo }}</p>
                  <p class="mb-1">
                    Alternative Phone number {{ form.altPhoneno }}
                  </p>
                  <p class="mb-1">Residential Address {{ form.address }}</p>
                  <p class="mb-1">Country {{ form.residentialCountry }}</p>

                  <p class="mb-1">State {{ form.selectedState }}</p>
                  <VDivider class="my-4" />
                  <h6 class="text-base font-weight-medium mb-2">
                    Church Details
                  </h6>

                  <p class="mb-1">Country {{ form.churchCountryName }}</p>
                  <p class="mb-1">State {{ form.selectedParishState }}</p>
                  <p class="mb-1">
                    Parish: {{ form.userParish }} - {{ form.userParishCode }}
                  </p>
                </div>
              </VWindowItem>
            </VWindow>
            <div class="d-flex justify-space-between mt-8">
              <VBtn
                color="secondary"
                :disabled="currentStep === 0"
                variant="tonal"
                @click="currentStep--"
              >
                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                Previous
              </VBtn>

              <VBtn color="secondary" variant="tonal">
                <router-link to="/login">
                  <p class="mb-0">
                    If you have an account, please login &rarr;
                  </p>
                </router-link>
              </VBtn>

              <VBtn
                v-if="items.length - 1 === currentStep"
                color="success"
                append-icon="tabler-check"
                @click="isConfirmDialogVisible = true"
              >
                Submit
              </VBtn>

              <VBtn
                v-else
                :disabled="isNextButtonDisabled"
                @click="currentStep++"
              >
                Next

                <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
              </VBtn>
            </div>
            <ConfirmDialog
              v-model:isDialogVisible="isConfirmDialogVisible"
              :api-response="apiResponseStatus"
              confirmation-question="You are about to confirm this ministry Did you want to continue ?"
              cancel-msg="Registration Cancelled!!"
              cancel-title="Cancelled"
              :confirm-msg="apiResponseMessage"
              confirm-title="Registered!"
              @confirm="onSubmit"
              @cancel="onCancel"
            />
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
#loading-bg {
  position: absolute;
  display: block;
  background: var(--initial-loader-bg #fff);
  block-size: 100%;
  inline-size: 100%;
}

.loading-logo {
  position: absolute;
  inset-block-start: 40%;
  inset-inline-start: calc(50% - 45px);
}

.loading {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 50%;
  block-size: 55px;
  inline-size: 55px;
  inset-block-start: 50%;
  inset-inline-start: calc(50% - 35px);
}

.loading .effect-1,
.loading .effect-2,
.loading .effect-3 {
  position: absolute;
  box-sizing: border-box;
  border: 3px solid transparent;
  border-radius: 50%;
  block-size: 100%;
  border-inline-start: 3px solid var(--initial-loader-color, #eee);
  inline-size: 100%;
}

.loading .effect-1 {
  animation: rotate 1s ease infinite;
}

.loading .effect-2 {
  animation: rotate-opacity 1s ease infinite 0.1s;
}

.loading .effect-3 {
  animation: rotate-opacity 1s ease infinite 0.2s;
}

.loading .effects {
  transition: all 0.3s ease;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(1turn);
  }
}

@keyframes rotate-opacity {
  0% {
    opacity: 0.1;
    transform: rotate(0deg);
  }

  100% {
    opacity: 1;
    transform: rotate(1turn);
  }
}
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
