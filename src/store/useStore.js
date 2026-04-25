import { create } from 'zustand'

export const useStore = create((set) => ({
  // UI state
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Theme
  darkMode: false,
  toggleDark: () => set(s => {
    const next = !s.darkMode
    document.documentElement.classList.toggle('dark', next)
    return { darkMode: next }
  }),

  // Filters
  filters: {
    category: null,
    maxDistance: 10,
    maxPrice: null,
    date: null,
  },
  setFilter: (key, val) => set(s => ({
    filters: { ...s.filters, [key]: val }
  })),
  clearFilters: () => set({
    filters: { category: null, maxDistance: 10, maxPrice: null, date: null }
  }),

  // Notification badge
  unreadCount: 2,
  setUnreadCount: (n) => set({ unreadCount: n }),
  decrementUnread: () => set(s => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),

  // Install prompt (PWA)
  installPrompt: null,
  setInstallPrompt: (prompt) => set({ installPrompt: prompt }),
}))
