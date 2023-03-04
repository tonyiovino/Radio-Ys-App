<template>
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
</template>

<script>
import { useTheme } from 'vuetify'

export default {
  setup() {
    const theme = useTheme()

    const toggleTheme = () =>
      (theme.global.name.value = theme.global.current.value.dark
        ? 'light'
        : 'dark')

    return {
      toggleTheme,
      theme,
    }
  },
}
</script>
