import { defineStore } from 'pinia'
import { fetchBmsDetail } from '@/api/bms'

export const useBmsStore = defineStore('bms', {
  state: () => ({
    detail: null,
    loading: false
  }),
  actions: {
    async loadDetail(cabinetId) {
      this.loading = true
      try {
        this.detail = await fetchBmsDetail(cabinetId)
      } finally {
        this.loading = false
      }
    }
  }
})
