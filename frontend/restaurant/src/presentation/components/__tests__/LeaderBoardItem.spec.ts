import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LeaderboardComponent from '@/presentation/components/LeaderBoardItem.vue' // Adjust the path accordingly
import { useSellersStore } from '@/stores/sellers'
import { createPinia, setActivePinia } from 'pinia'

const $t = () => {}

describe('LeaderboardComponent.vue', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should render the leaderboard correctly', () => {
    const sellersStore = useSellersStore()
    sellersStore.setSellersData([
      { id: 1, name: 'Seller One', identification: 'NID1', count: 10, observations: '' },
      { id: 2, name: 'Seller Two', identification: 'NID2', count: 20, observations: '' },
    ])

    const wrapper = mount(LeaderboardComponent, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    // Assert that the leaderboard title is rendered
    expect(wrapper.find('h3').text()).toBe('')

    // Assert table rows are rendered correctly
    const rows = wrapper.findAll('tr')
    expect(rows).toHaveLength(sellersStore.sellers.length)

    // Assert that the first seller is styled correctly
    expect(rows[0].find('td').text()).toBe('1')
    expect(rows[0].find('td').classes()).toContain('font-bold')
    expect(rows[0].find('td').classes()).toContain('text-amber-400')

    // Assert that the second seller is styled correctly
    expect(rows[1].find('td').text()).toBe('2')
    expect(rows[1].find('td').classes()).toContain('font-semibold')
    expect(rows[1].find('td').classes()).toContain('text-slate-600')

    // Assert that the seller names and counts are displayed correctly
    expect(rows[0].findAll('td')[1].text()).toBe('Seller Two')
    expect(rows[0].findAll('td')[2].text()).toBe('20')
  })

  it('should render no sellers if there are none', () => {
    // Act
    const wrapper = mount(LeaderboardComponent, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    // Assert that no rows are rendered
    const rows = wrapper.findAll('tr')
    expect(rows).toHaveLength(0)
  })
})
