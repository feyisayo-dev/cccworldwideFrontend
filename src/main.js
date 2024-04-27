
import '@/@fake-db/db'
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import 'flag-icons/css/flag-icons.min.css'
import { createPinia } from 'pinia'
import { createVPhoneInput } from 'v-phone-input'
import 'v-phone-input/dist/v-phone-input.css'
import VueConfirmPlugin from 'v3confirm'
import { createApp } from 'vue'
import CountryFlag from 'vue-country-flag-next'
import vueCountryRegionSelect from 'vue3-country-region-select'


const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg',
  
})


loadFonts()


// Create vue app
const app = createApp(App)

app.use(vueCountryRegionSelect)
app.component('CountryFlag', CountryFlag)
app.use(VueConfirmPlugin, {
  root: '#confirm',
  yesText: 'Yes',
  noText: 'No',
})

// Use plugins
app.use(vuetify)
app.use(vPhoneInput)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(i18n)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})

// Mount vue app
app.mount('#app')
