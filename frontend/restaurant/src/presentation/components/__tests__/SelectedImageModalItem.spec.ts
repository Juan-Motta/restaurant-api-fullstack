import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ModalComponent from '@/presentation/components/SelectedImageModalItem.vue'

const $t = (key: string) => key

vi.mock('@/utils/random', () => ({
  getRandomItem: vi.fn(),
}))

vi.mock('@/composables/useModal', () => ({
  useModal: () => ({
    closeModal: vi.fn(),
    isModalOpen: () => true, // Always return true to simulate an open modal
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('ModalComponent.vue', () => {
  it('should render the modal correctly', () => {
    const wrapper = mount(ModalComponent, {
      global: {
        mocks: {
          $t,
        },
      },
    })

    // Verify modal title and button texts
    expect(wrapper.find('h2').text()).toBe('show-image-modal-title')
    expect(wrapper.findAll('button')[0].text()).toBe('show-image-modal-button-1')
    expect(wrapper.findAll('button')[1].text()).toBe('show-image-modal-button-2')
  })
})
