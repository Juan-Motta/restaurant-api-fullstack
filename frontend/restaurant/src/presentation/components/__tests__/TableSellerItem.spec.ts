import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TableSellerItem from '@/presentation/components/TableSellerItem.vue'
import { useSellersStore } from '@/stores/sellers'

const $t = () => {}

describe('TableSellerItem.vue', () => {
  // Setup the Pinia store
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  // Test if the component renders correctly
  it('should render correctly', () => {
    const wrapper = mount(TableSellerItem, {
      global: {
        mocks: {
          $t,
        },
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('renders the table with seller data', () => {
    const sellersStore = useSellersStore()
    sellersStore.setSellersData([
      { id: 1, name: 'Seller One', identification: 'NID1', count: 10, observations: '' },
      { id: 2, name: 'Seller Two', identification: 'NID2', count: 20, observations: '' },
    ])

    // Act: Mount the component
    const wrapper = mount(TableSellerItem, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    // Assert: Check if the table renders correctly
    const rows = wrapper.findAll('tbody tr')
    // Verify that 2 rows are rendered
    expect(rows).toHaveLength(2)
    // Verify the content of the first row
    expect(rows[0].find('td:nth-child(1)').text()).toBe('2')
    expect(rows[0].find('td:nth-child(2)').text()).toBe('Seller Two')
    expect(rows[0].find('td:nth-child(3)').text()).toBe('NID2')
    expect(rows[0].find('td:nth-child(4)').text()).toBe('20')
    // Verify the content of the second row
    expect(rows[1].find('td:nth-child(1)').text()).toBe('1')
    expect(rows[1].find('td:nth-child(2)').text()).toBe('Seller One')
    expect(rows[1].find('td:nth-child(3)').text()).toBe('NID1')
    expect(rows[1].find('td:nth-child(4)').text()).toBe('10')
  })
})
