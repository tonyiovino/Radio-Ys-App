<template>
  <v-app>
    <v-app-bar>
      <v-toolbar-title>Radio YS</v-toolbar-title>
      <app-toggle-theme />
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition hide-on-leave>
          <component :is="Component"></component>
        </v-fade-transition>
      </router-view>
    </v-main>

    <v-bottom-navigation>
      <v-btn
        v-for="(btn, id) in buttons"
        :key="id"
        :active="btn.route == route.path"
        :to="btn.route"
      >
        <v-icon>{{ btn.icon }}</v-icon>

        <span>{{ btn.text }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import { computed, ref, reactive } from 'vue'
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'

import ToggleTheme from '@/components/ToggleTheme'

export default {
  components: {
    appToggleTheme: ToggleTheme,
  },

  setup() {
    const buttons = reactive({
      1: {
        icon: 'mdi-podcast',
        text: 'Podcast',
        route: '/podcast',
        isActive: false,
      },
      2: {
        icon: 'mdi-home',
        text: 'Home',
        route: '/',
        isActive: false,
      },
      3: {
        icon: 'mdi-book',
        text: 'Book',
        route: '/book',
        isActive: false,
      },
    })

    const route = useRoute()

    const theme = useTheme()

    const toggleTheme = () =>
      (theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark')

    return {
      toggleTheme,
      theme,
      route,
      buttons,
    }
  },
}
</script>
