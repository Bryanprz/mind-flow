import { create } from 'zustand'

export const useDashboardStore = create((set) => ({
  // User state
  currentUser: null,
  habitPlan: null,
  
  // UI state
  isLoading: false,
  showJournalModal: false,
  showAchievementModal: false,
  
  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),
  setHabitPlan: (plan) => set({ habitPlan: plan }),
  setLoading: (isLoading) => set({ isLoading }),
  toggleJournalModal: () => set((state) => ({ showJournalModal: !state.showJournalModal })),
  toggleAchievementModal: () => set((state) => ({ showAchievementModal: !state.showAchievementModal })),
  
  // Data refresh
  refreshData: async () => {
    set({ isLoading: true })
    try {
      // Fetch updated data from Rails API
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Accept': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content || '',
        },
      })
      if (response.ok) {
        const data = await response.json()
        set({ habitPlan: data.habitPlan })
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      set({ isLoading: false })
    }
  },
}))

