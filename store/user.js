import { defineStore } from 'pinia'
import { getDict } from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: ''
  }),
  getters: {},
  actions: {
    async getData() {
      const res = await getDict()
      console.log(res)
    }
  }
})
