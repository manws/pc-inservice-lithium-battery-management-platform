import { onMounted, onUnmounted, ref } from 'vue'

export function useClock() {
  const clock = ref('00:00')
  let timer = null

  function tick() {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    clock.value = `${hh}:${mm}`
  }

  onMounted(() => {
    tick()
    timer = setInterval(tick, 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { clock }
}
