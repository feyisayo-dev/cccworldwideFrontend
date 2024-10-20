<script setup>
import api from "@/apiservices/api";
import { useAppAbility } from "@/plugins/casl/useAppAbility";
import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import {
  default as authV2LoginIllustrationBorderedDark,
  default as authV2LoginIllustrationBorderedLight,
  default as authV2LoginIllustrationDark,
  default as authV2LoginIllustrationLight,
} from "@images/pages/ccclogo.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { emailValidator, requiredValidator } from "@validators";
import { VForm } from "vuetify/components/VForm";
import { onMounted, ref } from "vue";

const loading = ref(false);
const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const route = useRoute();
const router = useRouter();
const ability = useAppAbility();

const errors = ref({
  email: undefined,
  password: undefined,
});

const refVForm = ref();
const email = ref("");
const responseMessage = ref("");
const password = ref("");
const rememberMe = ref(false);

// The login function
// const login = () => {
//   axios.post('/auth/login', {
//     email: email.value,
//     password: password.value,
//   }).then(r => {
//     const { accessToken, userData, userAbilities } = r.data

//     localStorage.setItem('userAbilities', JSON.stringify(userAbilities))
//     ability.update(userAbilities)
//     localStorage.setItem('userData', JSON.stringify(userData))
//     localStorage.setItem('accessToken', JSON.stringify(accessToken))

//     // Redirect to `to` query if exist or redirect to index route
//     router.replace(route.query.to ? String(route.query.to) : '/')
//   }).catch(e => {
//     const { errors: formErrors } = e.response.data

//     errors.value = formErrors
//     console.error(e.response.data)
//   })
// }

const login = async () => {
  loading.value = true; // Set loading to true when login starts
  try {
    const response = await api.post("/login", {
      email: email.value,
      password: password.value,
    });

    if (response.data.userData) {
      // Success: Store user data and redirect
      const { accessToken, userData, userAbilities } = response.data;

      localStorage.setItem("userAbilities", JSON.stringify(userAbilities));
      ability.update(userAbilities);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("accessToken", JSON.stringify(accessToken));

      router.replace(route.query.to ? String(route.query.to) : "/");
    } else {
      // Handle the case where userData is not returned
      errors.value.general =
        response.data.message || "Unexpected error occurred. Please try again.";
    }
  } catch (error) {
    console.error("Login error:", error);

    // Check for specific error status codes and handle them
    if (error.response && error.response.status === 401) {
      errors.value.general =
        "Invalid credentials. Please check your email and password.";
    } else {
      errors.value.general =
        "An error occurred during login. Please try again later.";
    }
  } finally {
    loading.value = false; // Set loading to false when login is complete
  }
};

//submit to call the login function
const onSubmit = () => {
  //validate the input field of the form
  refVForm.value?.validate().then(({ valid: isValid }) => {
    //if valid login the called the login function
    if (isValid) login();
  });
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol lg="8" class="d-none d-lg-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="505"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg :src="authThemeMask" class="auth-footer-mask" />
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <router-link to="/landing">
            <p class="mb-0">Go home &rarr;</p>
          </router-link>

          <h5 class="text-h5 mb-1">
            Welcome to
            <span class="text-capitalize"> {{ themeConfig.app.title }} </span>!
            👋🏻
          </h5>
          <p class="mb-0">Please sign-in to your account</p>
        </VCardText>
        <VForm ref="refVForm" @submit.prevent="onSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <AppTextField
                v-model="email"
                label="Email"
                type="email"
                autofocus
                :rules="[requiredValidator, emailValidator]"
                :error-messages="errors.email"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <AppTextField
                v-model="password"
                label="Password"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :error-messages="errors.password"
                :append-inner-icon="
                  isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                "
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />

              <div
                class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4"
              >
                <VCheckbox v-model="rememberMe" label="Remember me" />
                <RouterLink
                  class="text-primary ms-2 mb-1"
                  :to="{ name: 'forgot-password' }"
                >
                  Forgot Password?
                </RouterLink>
              </div>
            </VCol>

            <!-- Error Message -->
            <VCol cols="12">
              <p v-if="errors.general" class="text-danger">
                {{ errors.general }}
              </p>
            </VCol>

            <VCol cols="12">
              <VBtn block type="submit" :disabled="loading">
                <template v-if="loading">
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </template>
                <template v-else> Login </template>
              </VBtn>
            </VCol>
          </VRow>
        </VForm>

        <router-link to="/register">
            <p class="mb-0">If you dont have an account, please register &rarr;</p>
          </router-link>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
