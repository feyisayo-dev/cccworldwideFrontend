<script setup>
import { VDataTable } from 'vuetify/labs/VDataTable'
const isLoading = ref(false)

const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const userData = JSON.parse(localStorage.getItem('userData') || '{}');
const isConfirmDialogVisible = ref(false)

const passwordRequirements = [
  'Minimum 8 characters long - the more, the better',
  'At least one lowercase character',
  'At least one number, symbol, or whitespace character',
]

const isOneTimePasswordDialogVisible = ref(false)

const changePassword = async () => {
  isLoading.value = true; // Start loading

  try {
    const response = await api.post(`/changePassword/${userData.UserId}`, {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    });

    console.log('Password changed successfully', response.data);

  } catch (error) {
    console.error('Error changing password:', error);

  } finally {
    isLoading.value = false; // Stop loading after the request is done
  }
};
const onSubmit = message => {

  // eslint-disable-next-line sonarjs/no-all-duplicated-branches
  if (message) {
    changePassword()
  }
}

</script>

<template>
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm>
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <AppTextField v-model="currentPassword" :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Current Password" @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible" />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <AppTextField v-model="newPassword" :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'" label="New Password"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <AppTextField v-model="confirmPassword" :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  label="Confirm New Password"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <h6 class="text-base font-weight-medium mb-3">
              Password Requirements:
            </h6>

            <VList class="card-list">
              <VListItem v-for="item in passwordRequirements" :key="item" :title="item" class="text-medium-emphasis">
                <template #prepend>
                  <VIcon size="8" icon="tabler-circle" class="me-3" />
                </template>
              </VListItem>
            </VList>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn color="success" append-icon="tabler-check" @click="isConfirmDialogVisible = true" :loading="isLoading"
              :disabled="isLoading">
              Save changes
            </VBtn>

            <VBtn type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Two-steps verification -->
    <VCol cols="12">
      <VCard title="Two-steps verification">
        <VCardText>
          <h6 class="text-base font-weight-medium mb-3">
            Two factor authentication is not enabled yet.
          </h6>
          <p>
            Two-factor authentication adds an additional layer of security to your account by
            <br>
            requiring more than just a password to log in.
            <a href="javascript:void(0)" class="text-decoration-none">Learn more.</a>
          </p>

          <VBtn @click="isOneTimePasswordDialogVisible = true">
            Enable 2FA
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>

  <!-- SECTION Enable One time password -->
  <TwoFactorAuthDialog v-model:isDialogVisible="isOneTimePasswordDialogVisible" />
  <ConfirmDialog v-model:isDialogVisible="isConfirmDialogVisible" :api-response="apiResponseStatus"
    confirmation-question="You are about to confirm this password Did you want to continue ?"
    cancel-msg="Cancelled!!" cancel-title="Cancelled" :confirm-msg="apiResponseMessage"
    confirm-title="Password Changed!" @confirm="onSubmit" @cancel="onCancel" />
  <!-- !SECTION -->
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 5px;
}

.server-close-btn {
  inset-inline-end: 0.5rem;
}
</style>
