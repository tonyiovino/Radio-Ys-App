<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Radio YS</v-toolbar-title>
      <app-toggle-theme />
    </v-app-bar>

    <v-main>
      <app-home />
    </v-main>

    <v-bottom-navigation mode="shift">
      <v-btn>
        <v-icon>mdi-television-play</v-icon>

        <span>Video</span>
      </v-btn>

      <v-btn active>
        <v-icon>mdi-home</v-icon>

        <span>Home</span>
      </v-btn>

      <v-btn>
        <v-icon>mdi-book</v-icon>

        <span>Book</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import { computed, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'

import Home from '@/views/Home'
import ToggleTheme from '@/components/ToggleTheme'

export default {
  components: {
    appHome: Home,
    appToggleTheme: ToggleTheme,
  },

  setup() {
    const drawer = ref(null)

    const route = useRoute()

    const theme = useTheme()

    const toggleTheme = () =>
      (theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark')

    return {
      drawer,
      toggleTheme,
      theme,
      route,
    }
  },
}
</script>
