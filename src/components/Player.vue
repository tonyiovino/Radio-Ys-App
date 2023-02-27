<template>
  <v-card
    style="text-align: center"
    :flat="flat == undefined || flat == false ? false : true"
    max-width="400"
  >
    <v-card-text>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click="playing ? pause() : play()"
        :disabled="!loaded"
      >
        <v-icon v-if="!playing || paused">{{ playIcon }}</v-icon>
        <v-icon v-else>{{ pauseIcon }}</v-icon>
      </v-btn>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click="stop()"
        :disabled="!loaded"
      >
        <v-icon>{{ stopIcon }}</v-icon>
      </v-btn>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click="mute()"
        :disabled="!loaded"
      >
        <v-icon v-if="!isMuted">{{ volumeHighIcon }}</v-icon>
        <v-icon v-else>{{ volumeMuteIcon }}</v-icon>
      </v-btn>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click="loaded ? download() : reload()"
        v-if="!loaded"
      >
        <v-icon>{{ refreshIcon }}</v-icon>
      </v-btn>
      <v-btn
        outlined
        icon
        class="ma-2"
        :color="color"
        @click.="loaded ? download() : reload()"
        v-if="loaded && downloadable"
      >
        <v-icon>{{ downloadIcon }}</v-icon>
      </v-btn>
      <!-- <v-slider
        v-model="playerVolume"
        :prepend-icon="volumeHighIcon"
        max="1"
        step="0.01"
        min="0"
      ></v-slider>
      <v-progress-linear
        v-model="percentage"
        height="5"
        style="margin-top: 15px; margin-bottom: 15px"
        @click="setPosition()"
        :disabled="!loaded"
      ></v-progress-linear>
      <p>{{ currentTime }} / {{ duration }}</p> -->
    </v-card-text>
    <audio
      id="player"
      ref="player"
      v-on:ended="ended"
      v-on:canplay="canPlay"
      :src="file"
    ></audio>
  </v-card>
</template>
<script>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'vuetify-audio',
  props: {
    flat: {
      type: Boolean,
      default: false,
    },
    file: {
      type: String,
      default: null,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    ended: {
      type: Function,
      default: () => {},
    },
    canPlay: {
      type: Function,
      default: () => {},
    },
    color: {
      type: String,
      default: null,
    },
    downloadable: {
      type: Boolean,
      default: false,
    },
    playIcon: {
      type: String,
      default: 'mdi-play',
    },
    pauseIcon: {
      type: String,
      default: 'mdi-pause',
    },
    stopIcon: {
      type: String,
      default: 'mdi-stop',
    },
    refreshIcon: {
      type: String,
      default: 'mdi-refresh',
    },
    downloadIcon: {
      type: String,
      default: 'mdi-download',
    },
    volumeHighIcon: {
      type: String,
      default: 'mdi-volume-high',
    },
    volumeMuteIcon: {
      type: String,
      default: 'mdi-volume-mute',
    },
  },

  setup() {
    const player = ref(null)
    const firstPlay = ref(true)
    const isMuted = ref(false)
    const loaded = ref(false)
    const playing = ref(false)
    const paused = ref(false)
    const percentage = ref(0)
    const currentTime = ref('00:00:00')
    const audio = ref(undefined)
    const totalDuration = ref(0)
    const playerVolume = ref(0.2)

    const formatTime = (second) => {
      new Date(second * 1000).toISOString().substr(11, 8)
    }

    // const setPosition = () => {
    //   audio.currentTime = parseInt((audio.duration / 100) * percentage)
    // }
    // const stop = () => {
    //   audio.pause()
    //   paused = true
    //   playing = false
    //   audio.currentTime = 0
    // }
    const play = () => {
      if (playing) return
      audio.value.play().then((_) => (playing = true))
      paused = false
    }
    // const pause = () => {
    //   paused = !paused
    //   paused ? audio.pause() : audio.play()
    // }
    // const download = () => {
    //   audio.pause()
    //   window.open(file, 'download')
    // }
    // const mute = () => {
    //   isMuted = !isMuted
    //   audio.muted = isMuted
    // }
    const reload = () => {
      audio.load()
    }

    const _handleLoaded = () => {
      if (audio.readyState >= 2) {
        if (audio.duration === Infinity) {
          // Fix duration for streamed audio source or blob based
          // https://stackoverflow.com/questions/38443084/how-can-i-add-predefined-length-to-audio-recorded-from-mediarecorder-in-chrome/39971175#39971175
          audio.currentTime = 1e101
          audio.ontimeupdate = () => {
            audio.ontimeupdate = () => {}
            audio.currentTime = 0
            totalDuration = parseInt(audio.duration)
            loaded = true
          }
        } else {
          totalDuration = parseInt(audio.duration)
          loaded = true
        }
        if (autoPlay) audio.play()
      } else {
        throw new Error('Failed to load sound file')
      }
    }
    const _handlePlayingUI = (e) => {
      audio.volume = playerVolume
      percentage = (audio.currentTime / audio.duration) * 100
      currentTime = formatTime(audio.value.currentTime)
      playing = true
    }
    const _handlePlayPause = (e) => {
      if (e.type === 'play' && firstPlay) {
        // in some situations, audio.currentTime is the end one on chrome
        audio.currentTime = 0
        if (firstPlay) {
          firstPlay = false
        }
      }
      if (e.type === 'pause' && paused === false && playing === false) {
        currentTime = '00:00:00'
      }
    }

    const _handleEnded = () => {
      paused = playing = false
    }
    const init = () => {
      audio.addEventListener('timeupdate', _handlePlayingUI)
      audio.addEventListener('loadeddata', _handleLoaded)
      audio.addEventListener('pause', _handlePlayPause)
      audio.addEventListener('play', _handlePlayPause)
      audio.addEventListener('ended', _handleEnded)
    }

    onMounted(() => {
      console.log('player', player.value)
      audio.value = player.value
      console.log(audio.value)
      // init()
    })

    onBeforeUnmount(() => {
      // audio.removeEventListener('timeupdate', _handlePlayingUI)
      // audio.removeEventListener('loadeddata', _handleLoaded)
      // audio.removeEventListener('pause', _handlePlayPause)
      // audio.removeEventListener('play', _handlePlayPause)
      // audio.removeEventListener('ended', _handleEnded)
    })

    return {
      firstPlay,
      isMuted,
      loaded,
      playing,
      paused,
      percentage,
      currentTime,
      audio,
      totalDuration,
      playerVolume,
    }
  },
}
</script>
