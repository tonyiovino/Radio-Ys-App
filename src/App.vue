<template>
  <v-app>
    <v-navigation-drawer v-model="drawer">
      <!-- Componente A parte -->
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <!-- <v-icon>$vuetify.icons.custom</v-icon> -->
      <v-toolbar-title>Radio-YS</v-toolbar-title>
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
