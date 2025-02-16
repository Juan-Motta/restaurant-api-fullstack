import { reactive, toRefs } from 'vue'

interface ModalState {
  modals: Record<string, boolean>
  contexts: Record<string, unknown>
}

const state = reactive<ModalState>({
  modals: {},
  contexts: {},
})

export function useModal<T>(modalId: string) {
  const openModal = (context?: T): void => {
    state.modals[modalId] = true
    state.contexts[modalId] = context
  }

  const closeModal = (): void => {
    state.modals[modalId] = false
    delete state.contexts[modalId]
  }

  const isModalOpen = (): boolean => {
    return !!state.modals[modalId]
  }

  const getContext = (): T => {
    return state.contexts[modalId] as T
  }

  return {
    ...toRefs(state),
    openModal,
    closeModal,
    isModalOpen,
    getContext,
  }
}
