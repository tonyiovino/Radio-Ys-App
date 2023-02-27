<template>
  <v-container class="h-75" fluid>
    <v-row align-content="center" justify="center" dense>
      <v-col cols="6">
        <app-radio />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Radio from '@/components/Radio.vue'

export default {
  components: {
    appRadio: Radio,
  },
  setup() {},
}
</script>

<style></style>
