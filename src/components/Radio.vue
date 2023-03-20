<template>
  <app-player
    :data="{
      src: options.file,
      title: options.title,
      coverImage: options.coverImage,
    }"
  ></app-player>
</template>

<script>
import { reactive } from 'vue'
import AudioPlayer from '@/components/Player/Player.vue'

export default {
  components: {
    appPlayer: AudioPlayer,
  },
  setup() {
    const options = reactive({
      file: 'https://www.gettingequippedforeurope.edu.it:8000/radio.mp3',
      title: 'Radio YS',
      coverImage: 'src/assets/LogoRadioDefault.jpg',
    })

    return {
      options,
    }
  },
}
</script>
