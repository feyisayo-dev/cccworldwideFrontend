<script setup>
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import {
  default as registerMultistepIllustrationDark,
  default as registerMultistepIllustrationLight,
} from "@images/illustrations/ccclogo.png";
import registerMultistepBgDark from "@images/pages/register-multistep-bg-dark.png";
import registerMultistepBgLight from "@images/pages/register-multistep-bg-light.png";

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
</script>

<template>
  <div class="h-100 d-flex align-center justify-space-between">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      powered by
      <div style="width: 40px">
        <VImg :src="registerMultistepIllustration"  class="illustration-image" />
        <VImg
          :src="registerMultistepBg"
          class="bg-image position-absolute w-90"
        />
      </div>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <span class="d-flex align-center">
        &copy;
        {{ new Date().getFullYear() }}
        powered by
        <div style="width: 40px">
          <VImg
            :src="registerMultistepIllustration"
            class="illustration-image"
          />
          <VImg
            :src="registerMultistepBg"
            class="bg-image position-absolute w-90"
          />
        </div>
      </span>
    </span>
  </div>
</template>
