// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Icons
import IconRadioYS from '@/components/icons/IconRadioYS.vue'

// Components
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
  },
  icons: {
    values: {
      custom: {
        // name of our custom icon
        component: IconRadioYS, // our custom component
      },
    },
  },
})
