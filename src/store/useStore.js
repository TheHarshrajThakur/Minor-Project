import { create } from 'zustand'

export const useStore = create((set) => ({
  activeModel: null,
  isDetailOpen: false,
  setActiveModel: (model) => set({ activeModel: model, isDetailOpen: true }),
  closeDetail: () => set({ isDetailOpen: false, activeModel: null }),
}))
