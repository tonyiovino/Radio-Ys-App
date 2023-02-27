<template>
  <app-player
    :option="{
      src: file,
      title: 'Radio YS',
      coverImage: 'src/assets/LogoRadioDefault.jpg',
    }"
  ></app-player>
</template>

<script>
import { ref } from 'vue'
// import Player from '@/components/Player.vue'
import AudioPlayer from '@/components/Player/NewPlayer.vue'

export default {
  components: {
    appPlayer: AudioPlayer,
  },
  setup() {
    const file = ref(
      'https://www.gettingequippedforeurope.edu.it:8000/radio.mp3',
    )
    const color = ref(null)
    const btnText = ref('Set Color to "Success" (Green)')

    return {
      file,
      color,
      btnText,
    }
  },
}
</script>
