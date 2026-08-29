<template>
  <div class="viewport">
    <div class="stage" :class="stageClass" :style="{ transform: `scale(${scale})` }">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

defineProps({
  stageClass: {
    type: [String, Array, Object],
    default: ''
  }
})

const BASE_W = 1280
const BASE_H = 800
const scale = ref(1)

function fit() {
  scale.value = Math.min(window.innerWidth / BASE_W, window.innerHeight / BASE_H)
}

onMounted(() => {
  fit()
  window.addEventListener('resize', fit)
})

onUnmounted(() => {
  window.removeEventListener('resize', fit)
})
</script>

<style scoped>
.viewport {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage {
  position: relative;
  width: 1280px;
  height: 800px;
  flex: none;
  overflow: hidden;
  transform-origin: center center;
  background: #050f24;
}
</style>
