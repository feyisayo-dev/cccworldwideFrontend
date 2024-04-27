<script setup>
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { default as registerMultistepIllustrationDark, default as registerMultistepIllustrationLight } from '@images/illustrations/ccclogo.png'
import registerMultistepBgDark from '@images/pages/register-multistep-bg-dark.png'
import registerMultistepBgLight from '@images/pages/register-multistep-bg-light.png'

const registerMultistepBg = useGenerateImageVariant(registerMultistepBgLight, registerMultistepBgDark)
const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const registerMultistepIllustration = useGenerateImageVariant(registerMultistepIllustrationLight,
  registerMultistepIllustrationDark)

const radioContent = [{
  title: 'Starter',
  desc: 'A simple start for everyone.',
  value: '0',
},
{
  title: 'Standard',
  desc: 'For small to medium businesses.',
  value: '99',
},
{
  title: 'Enterprise',
  desc: 'Solution for big organizations.',
  value: '499',
}]

const items = [{
  title: 'Account',
  subtitle: 'Account Details',
  icon: 'tabler-smart-home',
},
{
  title: 'Personal Details',
  subtitle: 'Personal Information',
  icon: 'tabler-users',
},
{
  title: 'Anoiting Details',
  subtitle: 'Joinning/Anoiting Details',
  icon: 'tabler-file-text',
},
{
  title: 'Contact Details',
  subtitle: 'Contact Details',
  icon: 'tabler-file-text',
},
{
  title: 'Church Details',
  subtitle: 'Church Information',
  icon: 'tabler-file-text',
}]

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  link: '',
  firstName: '',
  lastName: '',
  mobile: '',
  pincode: '',
  address: '',
  landmark: '',
  city: '',
  state: null,
  selectedPlan: '0',
  cardNumber: '',
  cardName: '',
  expiryDate: '',
  cvv: '',
})

const onSubmit = () => {
  // eslint-disable-next-line no-alert
  alert('Submitted..!!')
}
</script>

<template>
  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      cols="20"
      md="8"
      class="auth-card-v2 d-flex align-center justify-center pa-10"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        class="mt-18 mt-bg-0"
      >
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          icon-size="24"
          class="stepper-icon-step-bg mb-8"
        />

        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
          style="max-width: 681px;"
        >
          <VForm>
            <!-- This is account details step view -->
            <VWindowItem>
              <h5 class="text-h5 mb-1">
                Account Information
              </h5>
              <p class="text-sm">
                Enter Your Account Details
              </p>

              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.email"
                    label="Email"
                    placeholder="Enter your Email"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.password"
                    label="Password"
                    placeholder="Enter your Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your Password"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </VCol>

                <!--
                  <VCol cols="12">
                  <AppTextField
                  v-model="form.link"
                  label="Profile Link"
                  type="url"
                  />
                  </VCol>
                -->
              </VRow>
            </VWindowItem>
            <!-- This is personal details step view -->
            <VWindowItem>
              <h5 class="text-h5 mb-1">
                Personal Information
              </h5>
              <p class="text-sm">
                Enter Your Personal Information
              </p>

              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.SurnameName"
                    label="Surname Name"
                    placeholder="Enter your Surname Name"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.firstName"
                    label="First Name"
                    placeholder="Enter your First Name"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.middleName"
                    label="Middle Name"
                    placeholder="Enter your Middle Name"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="form.gender"
                    label="Gender"
                    :items="['Male', 'Female']"
                    placeholder=" Select your gender"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.dob"
                    type="date"
                    label="DOB Your year of birth is not show to anyone"
                  />f
                </VCol>
              </VRow>
            </VWindowItem>
            <!-- This is joinnning/Anoting details step view -->
            <VWindowItem>
              <h5 class="text-h5 mb-1">
                Joinning/Anoiting Information
              </h5>
              <p class="text-sm">
                Enter Your Joinning/Anoiting
              </p>

              <VRow>
                <VCol cols="12">
                  <AppSelect
                    v-model="form.memberstatus"
                    label="Member Status"
                    placeholder="Select status "
                    :items="['Member/Laity', 'Vineyard Worker']"
                  />
                </VCol>

                <VCol cols="12">
                  <AppSelect
                    v-model="form.VineyardStatus"
                    label="Vineyard Status"
                    placeholder="Select status "
                    :items="['Shepherd','Asst. Shepherd','Shepherd','Asst. Shepherd','Wolider','Church Worker','Wolima']"
                  />
                </VCol>

                <VCol
                  cols="6"
                  md="6"
                >
                  <AppSelect
                    v-model="form.title"
                    label="Present Title"
                    placeholder="Select Title"
                    :items="['Brother','Evangelist','Elder Sister','Snr Elder Sister','Sister','Senior Evangelist','Snr Sister','Evangelist','Senior Evangelist','Cape Eld. Brother','Sup/Snr/Pro/E/Sister']"
                  />
                </VCol>

                <VCol
                  cols="6"
                  md="6"
                >
                  <AppTextField
                    v-model="form.dot"
                    type="date"
                    label="Date of present Anoitment"
                  />
                </VCol>

                <VCol cols="12">
                  <AppSelect
                    v-model="form.ministry"
                    label="Ministry"
                    placeholder="Select Ministry"
                    :items="['Prophet and Prophetess','Sidemen and Sidewomen','Music','Sunday School']"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <!-- This is contact details step view -->
            <VWindowItem>
              <h5 class="text-h5 mb-1">
                Contact Information
              </h5>
              <p class="text-sm">
                Enter Your contact details
              </p>

              <VRow>
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.mobile"
                    type="number"
                    label="Phone Mobile"
                    placeholder="Enter your Mobile number"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.mobile"
                    type="number"
                    label="Alternative Mobile number"
                    placeholder="Enter your Alternative Mobile number"
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextField
                    v-model="form.address"
                    label="Residence Address"
                    placeholder="Enter your Residencial address"
                  />
                </VCol>

                <VCol cols="12">
                  <AppSelect
                    v-model="form.Country"
                    label="Country"
                    placeholder="Select your Country of Residence"
                    :items="['Nigeria', 'Ghana', 'Mali', 'Togo', 'Congo']"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppSelect
                    v-model="form.state"
                    label="State"
                    :items="['New York', 'California', 'Florida', 'Washington', 'Texas']"
                    placeholder="Select your State"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.city"
                    label="City"
                    placeholder="Enter your Residencial City"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <VWindowItem>
              <h5 class="text-h5 mt-10">
                Church Information
              </h5>
              <p class="text-sm">
                Enter your current church information
              </p>
              <VRow>
                <VCol cols="12">
                  <AppSelect
                    v-model="form.Country"
                    label="Country"
                    placeholder="Select Country of church"
                    :items="['Nigeria', 'Ghana', 'Mali', 'Togo', 'Congo']"
                  />
                </VCol>

                <VCol
                  cols="6"
                  md="4"
                >
                  <AppSelect
                    v-model="form.state"
                    label="State"
                    :items="['New York', 'California', 'Florida', 'Washington', 'Texas']"
                    placeholder="Select your State"
                  />
                </VCol>

                <VCol cols="12">
                  <AppSelect
                    v-model="form.parish"
                    label="Parish"
                    placeholder="Select/type your parish"
                    :items="['Ogooluwa parish', 'Adeola Parish', 'Igbekele Parish']"
                  />
                </VCol>
              </VRow>
            </VWindowItem>
          </VForm>
        </VWindow>

        <div class="d-flex justify-space-between mt-8">
          <VBtn
            color="secondary"
            :disabled="currentStep === 0"
            variant="tonal"
            @click="currentStep--"
          >
            <VIcon
              icon="tabler-arrow-left"
              start
              class="flip-in-rtl"
            />
            Previous
          </VBtn>

          <VBtn
            v-if="items.length - 1 === currentStep"
            color="success"
            append-icon="tabler-check"
            @click="onSubmit"
          >
            submit
          </VBtn>

          <VBtn
            v-else
            @click="currentStep++"
          >
            Next

            <VIcon
              icon="tabler-arrow-right"
              end
              class="flip-in-rtl"
            />
          </VBtn>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
  @use "@core/scss/template/pages/page-auth.scss";

  .illustration-image {
    block-size: 550px;
    inline-size: 248px;
  }

  .bg-image {
    inset-block-end: 0;
  }
</style>

<route lang="yaml">
  meta:
  layout: blank
</route>
