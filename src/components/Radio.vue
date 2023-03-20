<template>
  <app-player
    :data="{
      src: file,
      title: title,
      coverImage: coverImage,
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
    const title = ref('Radio YS')
    const coverImage = ref('src/assets/LogoRadioDefault.jpg')
    const color = ref(null)
    const btnText = ref('Set Color to "Success" (Green)')

    return {
      file,
      title,
      coverImage,
      color,
      btnText,
    }
  },
}
</script>
