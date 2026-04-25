import { createClient } from '@supabase/supabase-js'

const url  = import.meta.env.VITE_SUPABASE_URL  || 'https://placeholder.supabase.co'
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
  realtime: {
    params: { eventsPerSecond: 10 }
  }
})

export const STORAGE_BUCKET_AVATARS     = 'avatars'
export const STORAGE_BUCKET_EXPERIENCES = 'experience-photos'
export const STORAGE_BUCKET_DOCUMENTS   = 'identity-documents'

export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
