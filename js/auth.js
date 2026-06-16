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

export async function getUsuario() {
  const session = await getSession()
  if (!session) return null
  const { data, error } = await supabase
    .from('usuarios')
    .select('*, tiendas(id, nombre, slug)')
    .eq('id', session.user.id)
    .single()
  if (error) return null
  return data
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) { window.location.href = '/index.html'; return null }
  return session
}

export async function requireRol(...roles) {
  const session = await getSession()
  if (!session) { window.location.href = '/index.html'; return null }
  const usuario = await getUsuario()
  if (!usuario) { window.location.href = '/index.html'; return null }
  if (!roles.includes(usuario.rol)) { window.location.href = '/pages/dashboard.html'; return null }
  return usuario
}

let _usuarioCache = null

export async function getUsuarioCache() {
  if (_usuarioCache) return _usuarioCache
  _usuarioCache = await getUsuario()
  return _usuarioCache
}

export function limpiarCache() {
  _usuarioCache = null
}