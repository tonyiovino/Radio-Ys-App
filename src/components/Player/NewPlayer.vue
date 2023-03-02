<template>
  <v-card class="text-center pb-2" variant="tonal" min-width="80%">
    <v-img v-if="!isPlaying" :lazy-src="option_.coverImage" height="60%" cover>
      <template v-slot:placeholder>
        <v-container class="d-flex align-center justify-center fill-height">
          <v-btn @click="play" icon class="rounded-circle" size="x-large">
            <v-icon icon="mdi-play" size="x-large" />
          </v-btn>
        </v-container>
      </template>
    </v-img>
    <v-img v-else :src="option_.coverImage" height="60%" cover />

    <v-card-title v-if="option_.title">
      {{ option_.title }}
    </v-card-title>
    <!-- <img
      :src="option_.coverImage ? option_.coverImage : CoverImageDefault"
      :class="`${
          isPlaying && option_.coverRotate ? 'audio__player-spin-anim' : ''
        }`"
        /> -->
    <v-card-actions class="justify-space-between">
      <v-row class="d-flex">
        <v-col cols="6" class="d-flex">
          <v-btn variant="text">
            <v-icon
              @click="toggleMute"
              :icon="isMuted ? `mdi-volume-mute` : `mdi-volume-high`"
              size="x-large"
            ></v-icon>
          </v-btn>
          <v-slider
            v-model="slider"
            :max="100"
            :min="0"
            :tick-size="1"
            density="default"
          ></v-slider>
        </v-col>
        <!-- <v-btn @click="show"> Clicca </v-btn> -->
        <v-col cols="6" class="d-flex align-center justify-center">
          <div class="audio__player-time">
            <span>{{ `${formatSecond(currentTime)}` }}</span>
          </div>

          <!-- <v-slider v-model="media" prepend-icon="mdi-volume-high"></v-slider> -->

          <div class="audio__player-progress-container">
            <div
              ref="audioProgressWrap"
              class="audio__player-progress-wrap"
              @click.stop="handleClickProgressWrap"
            >
              <div
                ref="audioProgress"
                class="audio__player-progress"
                :style="{
                  backgroundColor: option_.progressBarColor,
                }"
              ></div>
              <div
                ref="audioProgressPoint"
                class="audio__player-progress-point"
                :style="{
                  backgroundColor: option_.indicatorColor,
                  boxShadow: `0
                0 10px 0 ${option_.indicatorColor}`,
                }"
                @panstart="handleProgressPanStart"
                @panend="handleProgressPanEnd"
                @panmove="handleProgressPanMove"
              ></div>
            </div>
          </div>
        </v-col>
      </v-row>
      <!-- <v-btn @click="togglePlayer">
        <v-icon :icon="isPlaying ? `mdi-pause` : `mdi-play`" size="x-large" />
      </v-btn> -->
    </v-card-actions>

    <audio
      ref="audioPlayer"
      :src="option_.src"
      @ended="onAudioEnded"
      @play="onAudioPlay"
      @pause="onAudioPause"
      @mute="onAudioMute"
      @loadedmetadata="onLoadMetaData"
      @timeupdate="onTimeUpdate"
    ></audio>
  </v-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import Core from '@any-touch/core'
import Pan from '@any-touch/pan'
import { AudioPlayerOption, AudioPlayerOptionDefault } from './types'
import { formatSecond } from './utils'
// import IconPlay from '../assets/images/play.png'
// import IconPause from '../assets/images/pause.png'
// import CoverImageDefault from '@/assets/LogoRadioDefault'

const mergeOption = (option: AudioPlayerOption): AudioPlayerOption => {
  return {
    src: option.src || AudioPlayerOptionDefault.src,
    title: option.title || AudioPlayerOptionDefault.title,
    autoPlay: option.autoPlay || AudioPlayerOptionDefault.autoPlay,
    coverImage: option.coverImage || AudioPlayerOptionDefault.coverImage,
    coverRotate: option.coverRotate || AudioPlayerOptionDefault.coverRotate,
    progressBarColor:
      option.progressBarColor || AudioPlayerOptionDefault.progressBarColor,
    indicatorColor:
      option.indicatorColor || AudioPlayerOptionDefault.indicatorColor,
  }
}

export default defineComponent({
  props: {
    option: {
      type: Object as PropType<AudioPlayerOption>,
      default: AudioPlayerOptionDefault,
    },
  },
  emits: [
    'loadedmetadata',
    'playing',
    'play',
    'play-error',
    'timeupdate',
    'pause',
    'mute',
    'unmute',
    'ended',
    'progress-start',
    'progress-end',
    'progress-move',
    'progress-click',
  ],
  setup(props, { emit }) {
    const slider = ref(100)

    const audioPlayer = ref()
    const audioProgressWrap = ref()
    const audioProgressPoint = ref()
    const audioProgress = ref()
    const progressInterval = 200
    const option_ = ref<AudioPlayerOption>(mergeOption(props.option))
    let toucher: any = null
    let timer: any = null
    const state = reactive({
      isPlaying: false,
      isDragging: false,
      isMuted: false,
      currentTime: 0,
      totalTime: 0,
      totalTimeStr: '00:00',
    })

    // const newVolume = computed(() => {
    //   audioPlayer.value.volume = slider.value / 100
    //   return audioPlayer.value.volume
    // })

    //tips: initialize the state when switch music.
    const initState = () => {
      state.isPlaying = false
      state.isMuted = false
      state.isDragging = false
      state.currentTime = 0
      state.totalTime = 0
      state.totalTimeStr = '00:00'
    }
    const playUpdate = () => {
      if (state.isDragging) {
        return
      }
      const offsetLeft =
        (audioPlayer.value.currentTime / audioPlayer.value.duration) *
        audioProgressWrap.value.offsetWidth
      state.currentTime = audioPlayer.value.currentTime
      audioProgress.value.style.width = `${offsetLeft}px`
      audioPlayer.value.volume = slider.value / 100
      setPointPosition(offsetLeft)
      emit('playing')
    }
    const startTimer = () => {
      clearTimer()
      timer = window.setInterval(playUpdate, progressInterval)
      state.isPlaying = true
    }
    const clearTimer = () => {
      if (timer) {
        window.clearInterval(timer)
        timer = null
      }
    }
    const play = () => {
      audioPlayer.value
        .play()
        .then(() => {
          startTimer()
          setTotalTime(audioPlayer.value.duration)
        })
        .catch((error: any) => {
          emit('play-error', error)
        })
    }
    const pause = () => {
      audioPlayer.value.pause()
      state.isPlaying = false
    }
    const mute = () => {
      audioPlayer.value.muted = true
      state.isMuted = true
    }
    const unmute = () => {
      audioPlayer.value.muted = false
      state.isMuted = false
    }
    const togglePlayer = () => {
      if (state.isPlaying) {
        pause()
      } else {
        play()
      }
    }
    const toggleMute = () => {
      if (state.isMuted) {
        unmute()
      } else {
        mute()
      }
    }
    const setTotalTime = (seconds: number) => {
      state.totalTime = seconds
      state.totalTimeStr = formatSecond(state.totalTime)
    }
    const onAudioEnded = () => {
      state.isPlaying = false
      clearTimer()
      emit('ended')
    }
    const onAudioPause = () => {
      state.isPlaying = false
      clearTimer()
      emit('pause')
    }
    const onAudioPlay = () => {
      state.isPlaying = true
      emit('play')
    }
    const onAudioMute = () => {
      state.isPlaying = true
      state.isMuted = true
      emit('mute')
    }
    const onAudioUnmute = () => {
      state.isPlaying = true
      state.isMuted = false
      emit('unmute')
    }
    const onLoadMetaData = (e: any) => {
      setTotalTime(e.target.duration)
      emit('loadedmetadata', e)
    }
    const onTimeUpdate = (event: any) => {
      emit('timeupdate', event)
    }
    const setPointPosition = (offsetLeft: number) => {
      audioProgressPoint.value.style.left = `${
        offsetLeft - audioProgressPoint.value.offsetWidth / 2
      }px`
    }
    const handleProgressPanStart = (event: any) => {
      state.isDragging = true
      emit('progress-start', event)
    }
    const handleProgressPanEnd = (event: any) => {
      audioPlayer.value.currentTime = state.currentTime
      play()
      state.isDragging = false
      emit('progress-end', event)
    }
    const handleProgressPanMove = (event: any) => {
      const pageX = event.x
      const bcr = event.target.getBoundingClientRect()
      const targetLeft = parseInt(getComputedStyle(event.target).left)
      let offsetLeft = targetLeft + (pageX - bcr.left)
      offsetLeft = Math.min(offsetLeft, audioProgressWrap.value.offsetWidth)
      offsetLeft = Math.max(offsetLeft, 0)
      setPointPosition(offsetLeft)
      audioProgress.value.style.width = `${offsetLeft}px`
      state.currentTime =
        (offsetLeft / audioProgressWrap.value.offsetWidth) * state.totalTime
      emit('progress-move', event)
    }
    const handleClickProgressWrap = (event: any) => {
      const { offsetX } = event
      if (event.target === audioProgressPoint.value) {
        return
      }
      state.currentTime =
        (offsetX / audioProgressWrap.value.offsetWidth) * state.totalTime
      audioPlayer.value.currentTime = state.currentTime
      setPointPosition(offsetX)
      audioProgress.value.style.width = `${offsetX}px`
      play()
      emit('progress-click', event)
    }
    watch(
      () => props.option,
      (newValue, oldValue) => {
        option_.value = mergeOption(newValue)
        initState()
        if (option_.value.autoPlay) {
          nextTick(() => {
            play()
          })
        }
      },
      { deep: true },
    )
    onMounted(() => {
      toucher = new Core(document.getElementById('app') || undefined, {
        preventDefault: false,
      })
      toucher.use(Pan)
    })
    onUnmounted(() => {
      if (toucher) toucher.destroy()
      // pause()
    })
    return {
      audioPlayer,
      option_,
      ...toRefs(state),
      onAudioEnded,
      onAudioPlay,
      onAudioPause,
      onAudioMute,
      onAudioUnmute,
      onLoadMetaData,
      onTimeUpdate,
      play,
      pause,
      mute,
      unmute,
      togglePlayer,
      toggleMute,
      formatSecond,
      handleProgressPanStart,
      handleProgressPanEnd,
      handleProgressPanMove,
      handleClickProgressWrap,
      audioProgressWrap,
      audioProgressPoint,
      audioProgress,
      // IconPlay,
      // IconPause,
      // CoverImageDefault,

      // test
      // setVolumeAudio,
      slider,
      // show,
    }
  },
})
</script>
