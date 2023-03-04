<template>
  <v-container class="h-screen align-start mb-10" fluid>
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
    <v-divider class="my-10 border-opacity-80"></v-divider>

    <v-carousel
      height="300"
      cycle
      hide-delimiter-background
      :show-arrows="false"
      delimiter-icon="mdi-cat"
    >
      <v-carousel-item
        v-for="img in images"
        :key="img"
        :src="img"
        cover
      ></v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script>
import Radio from '@/components/Radio.vue'
import { ref } from 'vue'

export default {
  components: {
    appRadio: Radio,
  },
  setup() {
    const length = ref(3)

    const images = ref([
      'https://cdn.vuetifyjs.com/images/cards/docks.jpg',
      'https://cdn.vuetifyjs.com/images/cards/hotel.jpg',
      'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
    ])

    return {
      length,
      images,
    }
  },
}
</script>

<style></style>
