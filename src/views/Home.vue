<template>
  <v-container class="d-flex h-75 align-center" fluid>
    <v-row align-content="center" justify="center" class="d-flex align-center">
      <v-col cols="12">
        <v-container class="justify-center">
          <app-radio />
        </v-container>
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
