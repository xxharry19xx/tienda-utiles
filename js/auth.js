import { supabase } from './supabase.js'

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function logout() {
  await supabase.auth.signOut()
  window.location.href = '/index.html'
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    window.location.href = '/tienda-utiles/'
    return null
  }
  return session
}
