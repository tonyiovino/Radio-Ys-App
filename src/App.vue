<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Radio YS</v-toolbar-title>
      <v-btn-toggle @click="toggleTheme" rounded="xl">
        <v-fade-transition mode="out-in">
          <v-btn
            v-if="theme.global.name.value == 'light'"
            icon="mdi-white-balance-sunny"
            value="light"
            variant="plain"
          ></v-btn>
          <v-btn
            v-else
            icon="mdi-moon-waning-crescent"
            value="dark"
            variant="plain"
          ></v-btn>
        </v-fade-transition>
      </v-btn-toggle>
    </v-app-bar>

    <v-main>
      <app-home-test v-if="route.path == '/test'" />
      <app-home v-else />
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
import HomeTest from '@/views/HomeTest'

export default {
  components: {
    appHome: Home,
    appHomeTest: HomeTest,
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
