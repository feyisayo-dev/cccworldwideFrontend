<script setup>
import { useAllAdminActions } from "@/apiservices/adminActions";
import laptopGirl from "@images/illustrations/laptop-girl.png";
import { onMounted, ref } from "vue";

const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["update:isDialogVisible", "updatedData", "changes"]);

const openDialog = () => {
  isDialogVisible.value = true;
};

const currentStep = ref(0);
const apiResponseStatus = ref("");
const apiResponseMessage = ref("");

const form = ref({
  countryList: [],
  stateList: [],
  parishList: [],
  selectedCountry: " ",
  selectedState: "",
  seletedParish: "",
  parishCategory: "",
  parishName: "",
  parishEmail: "",
  parishPhone1: "",
  parishPhone2: "",
  parishAddress: "",
  city: "",
  prefixedParishName: "",
  addNewParish: [],
});

const createApp = [
  {
    icon: "custom-home",
    title: "Details",

    // subtitle: 'Enter  Parish Details',
  },
  {
    icon: "tabler-check",
    title: "Catergory",

    // subtitle: 'Select Catergory',
  },

  // {
  //   icon: 'tabler-database',
  //   title: 'Database',
  //   subtitle: 'Select Database',
  // },
  // {
  //   icon: 'tabler-credit-card',
  //   title: 'Billing',
  //   subtitle: 'Payment Details',
  // },
  // {
  //   icon: 'tabler-check',
  //   title: 'Submit',
  //   subtitle: 'submit',
  // },
];

const dialogVisibleUpdate = (val) => {
  emit("update:isDialogVisible", val);
  currentStep.value = 0;
};

watch(props, () => {
  if (!props.isDialogVisible) currentStep.value = 0;
});

const onSubmit = (message) => {
  if (message) {
    const postData = {
      email: form.value.parishEmail,
      phone1: form.value.parishPhone1,
      phone2: form.value.parishPhone2,
      country: form.value.selectedCountry,
      category: form.value.parishCategory,
      state: form.value.selectedState,
      city: form.value.city,
      address: form.value.parishAddress,
      name: form.value.parishName,
      reportTo: form.value.seletedParish,
    };

    try {
      // Make the API call and handle the response
      allAdminActions
        .addNewParish(postData)
        .then((response) => {
          const apiStatus = response.data;

          apiResponseStatus.value = apiStatus.status;
          apiResponseMessage.value = apiStatus.message;
          if (apiResponseStatus.value === 200) {
            emit("changes");
          }
        })
        .catch((error) => {
          console.error("Error submitting data:", error);

          // Handle the error here, e.g., showing an error message
        });
    } catch (error) {
      console.log("Caught error in try-catch block:", error);
    }
  }
};

const selectedRadio = ref("primary");

const parishLevel = [
  "National",
  "Region",
  "State",
  "Area",
  "Province",
  "Circuit",
  "District",
  "Parish",
];

const allAdminActions = useAllAdminActions();

// 👉 Fetch countries and cache them in localStorage
const fetchCountries = async () => {
  const cachedCountries = localStorage.getItem('countries');

  if (cachedCountries) {
    // If the data exists, load it from localStorage
    console.log('Loaded countries from localStorage', JSON.parse(cachedCountries));
    
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
        console.log('This is my data', data);

        if (data.countries && data.countries.length > 0) {
          // Store fetched countries in localStorage
          localStorage.setItem('countries', JSON.stringify(data.countries));

          form.value.countryList = data.countries.map((country) => ({
            id: country.id,
            name: country.name,
            flag_img: country.flag_img,
            states: country.states,
          }));
        }
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }
};

// 👉 Fetch states by country and cache them in localStorage
const fetchStates = async () => {
  form.value.stateList = []; // Clear previous states

  if (form.value.selectedCountry) {
    // Check if states for the selected country are cached in localStorage
    const cachedStates = localStorage.getItem(`states_${form.value.selectedCountry}`);

    if (cachedStates) {
      // Load states from localStorage if available
      console.log('Loaded states from localStorage', JSON.parse(cachedStates));
      form.value.stateList = JSON.parse(cachedStates).map((countryState) => ({
        country_id: countryState.country_id,
        name: countryState.name,
      }));
    } else {
      try {
        // Fetch states from API if not found in localStorage
        const response = await allAdminActions.fetchStateByCountry(form.value.selectedCountry);

        if (response && Array.isArray(response) && response.length > 0) {
          const data = response;

          if (Array.isArray(data) && data.length > 0) {
            // Store fetched states in localStorage
            localStorage.setItem(`states_${form.value.selectedCountry}`, JSON.stringify(data));

            form.value.stateList = data.map((countryState) => ({
              country_id: countryState.country_id,
              name: countryState.name,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    }
  }
};


// 👉 FetchAll parish from state
const fetchParish = async () => {
  if (form.value.selectedState) {
    try {
      form.value.parishList = [];
      form.value.seletedParish = "Select parish";
      console.log("State selected", form.value.selectedState);

      const response = await allAdminActions.fetchStateParish(
        form.value.selectedState
      );

      console.log("State selected", response);

      const data = response.data;

      if (data.Allparish && data.Allparish.length > 0) {
        form.value.parishList = data.Allparish.map((parish) => ({
          // parishcode: parish.parishcode,
          parishname: parish.parishname,
          country: parish.country,
          states: parish.states,
          city: parish.city,
          parishaddress: parish.address,
          name: parish.parishname,
          parishcode: parish.parishcode,
        }));
      }
      console.log(form.value.parishList);
    } catch (error) {
      console("Error fetching data:");
    }
  }
};

onMounted(() => {
  fetchCountries();
});

watchEffect(() => {
  fetchStates();
  fetchParish();
});

const isConfirmDialogVisible = ref(false);

// Define a computed property to concatenate the prefix with parishName
const prefixedParishName = computed({
  get() {
    return "CCC-" + form.value.parishName;
  },
});
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
        <h5 class="text-h5 text-center mb-2">Create Parish</h5>
        <p class="text-sm text-center mb-8">
          Provide data with this form to create a new parish.
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
              <!-- 👉 details -->
              <VWindowItem>
                <VCol cols="12">
                  <VTextField
                    v-model="form.parishName"
                    prefix="CCC-"
                    label="Enter Parish Name"
                    variant="outlined"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="form.parishEmail"
                    label="Enter Parish Official email address"
                    variant="outlined"
                  />
                </VCol>
                <VCol cols="12">
                  <VPhoneInput
                    v-model="form.parishPhone1"
                    label="Official Phone Number"
                    country-label="Phone Number"
                    country-aria-label="Country for phone number"
                    default-country="NG"
                    invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                  />
                </VCol>

                <VCol cols="12">
                  <VPhoneInput
                    v-model="form.parishPhone2"
                    label="Alternative Phone number"
                    country-label="Phone Number"
                    country-aria-label="Country for phone number"
                    default-country="NG"
                    invalid-message="Phone number must be a valid phone number, begin with country code (example: 01 23 45 67 89)."
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    v-model="form.parishAddress"
                    label="Enter Parish Address"
                    rows="2"
                    variant="outlined"
                  />
                </VCol>
                <!--
                  <VRadioGroup v-model="createAppData.category">
                  <VList class="card-list">
                  <VListItem
                  v-for="category in categories"
                  :key="category.title"
                  @click="createAppData.category = category.slug"
                  >
                  <template #prepend>
                  <VAvatar
                  size="48"
                  rounded
                  variant="tonal"
                  :color="category.color"
                  :icon="category.icon"
                  />
                  </template>

                  <VListItemTitle class="mb-1">
                  {{ category.title }}
                  </VListItemTitle>
                  <VListItemSubtitle>
                  {{ category.subtitle }}
                  </VListItemSubtitle>

                  <template #append>
                  <VRadio :value="category.slug" />
                  </template>
                  </VListItem>
                  </VList>
                  </VRadioGroup>
                -->
              </VWindowItem>

              <!-- 👉 Frameworks -->
              <VWindowItem>
                <h6 class="text-h6 mb-4">Select Parish Category/Level</h6>
                <VDivider />
                <VRadioGroup v-model="form.parishCategory" inline>
                  <div>
                    <VRadio
                      v-for="parish in parishLevel"
                      :key="parish"
                      :label="parish"
                      :value="parish.toLocaleLowerCase()"
                    />
                  </div>
                </VRadioGroup>
                <VDivider />
                <VCol cols="12">
                  <VAutocomplete
                    v-model="form.selectedCountry"
                    label="Country"
                    :items="form.countryList"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    variant="outlined"
                    @change="fetchStates"
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
                <VCol cols="12">
                  <VAutocomplete
                    v-model="form.selectedState"
                    label="State"
                    :items="form.stateList"
                    item-title="name"
                    @change="fetchParish"
                  />
                </VCol>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.city"
                    label="City"
                    placeholder="Enter Parish City"
                  />
                </VCol>
                <!--
                  <VCol cols="12">
                  <span style="color: rgb(26, 196, 26);">Parish Address :{{ form.parish }}</span>
                  <AppSelect
                  v-model="form.seletedParish"
                  label="Parish"
                  clearable
                  :items="form.parishList"
                  item-value="parishcode"
                  :item-title="item => `${item.name}-${item.parishaddress}`"
                  :hint="`${form.seletedParish}`"
                  persistent-hint
                  double-line
                  />
                  </VCol>
                -->

                <VCol
                  v-if="
                    form.parishCategory != 'national' &&
                    form.parishCategory != ''
                  "
                  cols="12"
                >
                  <!--
                    <span style="color: rgb(26, 196, 26);">Parish Address :{{ form.parish }}</span> 
                 
                    <VAutocomplete
                    v-model="form.seletedParish"
                    label=" Select Parish"
                    :items="form.parishList"
                    item-value="id"
                    item-title="name"
                    :hint="`Address:${form.seletedParish}`"
                    persistent-hint
                    double-line
                    />
                  -->
                  <VAutocomplete
                    v-model="form.seletedParish"
                    label=" Select Parish your church is reporting to "
                    :items="form.parishList"
                    item-value="parishcode"
                    :item-title="(item) => `${item.name}-${item.parishaddress}`"
                    :hint="`${form.seletedParish}`"
                    persistent-hint
                    double-line
                  />
                </VCol>
              </VWindowItem>
            </VWindow>

            <div class="d-flex justify-space-between mt-8">
              <VBtn
                variant="tonal"
                color="secondary"
                :disabled="currentStep === 0"
                @click="currentStep--"
              >
                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                Previous
              </VBtn>

              <VBtn
                v-if="createApp.length - 1 === currentStep"
                color="success"
                @click="isConfirmDialogVisible = true"
              >
                submit
                <VIcon icon="tabler-check" end class="flip-in-rtl" />
              </VBtn>

              <VBtn v-else @click="currentStep++">
                Next

                <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VDialog>
  <!-- 👉 Confirm Dialog -->
  <ConfirmDialog
    v-model:isDialogVisible="isConfirmDialogVisible"
    :api-response="apiResponseStatus"
    confirmation-question="You are about to confirm this registration Did you want to continue ?"
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
