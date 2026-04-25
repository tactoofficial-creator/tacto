import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { mockUser } from '@/lib/mockData'

const USE_MOCK = !import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL === 'https://placeholder.supabase.co'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: true,

      init: async () => {
        if (USE_MOCK) {
          set({ user: mockUser, loading: false })
          return
        }
        const timeout = setTimeout(() => set({ loading: false }), 4000)
        try {
          const { data: { session } } = await supabase.auth.getSession()
          clearTimeout(timeout)
          if (session) {
            const profile = await get().fetchProfile(session.user.id)
            set({ session, user: profile, loading: false })
          } else {
            set({ loading: false })
          }
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
              const profile = await get().fetchProfile(session.user.id)
              set({ session, user: profile })
            } else {
              set({ session: null, user: null })
            }
          })
        } catch {
          clearTimeout(timeout)
          set({ loading: false })
        }
      },

      fetchProfile: async (id) => {
        const { data } = await supabase.from('users').select('*').eq('id', id).single()
        return data
      },

      signIn: async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return data
      },

      signUp: async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        })
        if (error) throw error
        return data
      },

      signOut: async () => {
        if (!USE_MOCK) await supabase.auth.signOut()
        set({ user: null, session: null })
      },

      updateProfile: async (updates) => {
        if (USE_MOCK) {
          set(s => ({ user: { ...s.user, ...updates } }))
          return
        }
        const { data } = await supabase
          .from('users')
          .update(updates)
          .eq('id', get().user.id)
          .select()
          .single()
        set({ user: data })
      },
    }),
    { name: 'tacto-auth' }
  )
)
