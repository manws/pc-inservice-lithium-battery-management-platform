import { defineStore } from 'pinia'
import { fetchChargingOverview } from '@/api/charging'

export const useChargingStore = defineStore('charging', {
  state: () => ({
    overview: null,
    loading: false
  }),
  getters: {
    chargingCount: (state) =>
      (state.overview?.cabinets || []).filter((item) => item.status === 'charging').length,
    idleCount: (state) =>
      (state.overview?.cabinets || []).filter((item) => item.status === 'idle').length
  },
  actions: {
    async loadOverview() {
      this.loading = true
      try {
        this.overview = await fetchChargingOverview()
      } finally {
        this.loading = false
      }
    }
  }
})
