import { createApp, ref } from 'vue'
import CreateParishDialog from '@/components/dialogs/CreateParishDialog.vue'
import vuetify from '@/plugins/vuetify' // Assuming you have Vuetify set up.
import { createVPhoneInput } from 'v-phone-input'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import 'flag-icons/css/flag-icons.min.css'
import 'v-phone-input/dist/v-phone-input.css'
import axios from '@axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg',
})


// Create the Vue app
const dialogApp = createApp({
  components: { CreateParishDialog },
  setup() {
    const isDialogVisible = ref(false)
    const apiResponseStatus = ref('') // Assuming this is the response you're handling

    const openDialog = () => {
      isDialogVisible.value = true
    }

    const changes = () => {
      isDialogVisible.value = false
    }

    return {
      isDialogVisible,
      openDialog,
      apiResponseStatus,
      changes,
    }
  },
  template: `
    <CreateParishDialog 
      :isDialogVisible="isDialogVisible" 
      :apiResponse="apiResponseStatus.toString()" 
      @update:isDialogVisible="isDialogVisible = $event" 
      @changes="changes" 
    />
  `,
})

// Mount the app to a specific div in your HTML.
const dialogInstance = dialogApp.use(vuetify).use(vPhoneInput).mount('#dialog-container')

// Attach the function to the global `window` object so it can be called from HTML.
window.openDialog = dialogInstance.openDialog
