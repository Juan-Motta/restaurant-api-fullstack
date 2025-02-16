import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InputComponent from '@/presentation/components/SearchItem.vue'

const $t = (key: string) => key // Mock translation function

// Mocking dependencies
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(), // Mock router's push method
  }),
  useRoute: () => ({
    query: {
      image: 'mockImageId', // Mock route query for initial test
    },
  }),
}))

describe('InputComponent.vue', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render the input and icon correctly', () => {
    const wrapper = mount(InputComponent, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    // Check for the input element
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    // Check the initial value set from route query
    expect(input.element.value).toBe('mockImageId')
  })

  it('should update input value on change', async () => {
    const wrapper = mount(InputComponent, {
      global: {
        mocks: {
          $t,
        },
      },
    })
    const input = wrapper.find('input')

    await input.setValue('newImageId')

    // Verify that the input value has updated
    expect(input.element.value).toBe('newImageId')
  })
})
