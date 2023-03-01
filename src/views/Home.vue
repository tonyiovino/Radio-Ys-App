<template>
  <v-container class="h-screen align-start" fluid>
    <v-row
      align-content="center"
      justify="center"
      class="d-flex align-center mt-10"
    >
      <v-col cols="12">
        <v-container class="justify-center">
          <app-radio />
        </v-container>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-divider class="border-opacity-100" inset></v-divider>
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
