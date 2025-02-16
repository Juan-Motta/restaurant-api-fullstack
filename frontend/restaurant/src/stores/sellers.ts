import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { SellersData } from '@/types/sellers'

export const useSellersStore = defineStore('sellers', () => {
  const sellers = ref<SellersData[]>([])

  const setSellersData = (newSellers: SellersData[]) => {
    newSellers.forEach((newSeller) => {
      const existingSellerIndex = sellers.value.findIndex((seller) => seller.id === newSeller.id)
      if (existingSellerIndex > -1) {
        sellers.value[existingSellerIndex] = { ...newSeller, ...sellers.value[existingSellerIndex] }
      } else {
        sellers.value.push(newSeller)
      }
    })
  }

  const getSortedSellersByCount = () => {
    return [...sellers.value].sort((a, b) => b.count - a.count)
  }

  const addPoint = (id: number, points: number) => {
    sellers.value = sellers.value.map((seller) => {
      if (seller.id === id) {
        return {
          ...seller,
          count: seller.count + points,
        }
      }
      return seller
    })
  }

  const resetPoints = () => {
    sellers.value = sellers.value.map((seller) => {
      return {
        ...seller,
        count: 0,
      }
    })
  }

  const getTotalPoints = () => {
    return sellers.value.reduce((total, seller) => total + seller.count, 0)
  }

  return { sellers, setSellersData, getSortedSellersByCount, addPoint, resetPoints, getTotalPoints }
})
