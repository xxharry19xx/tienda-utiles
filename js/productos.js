import { supabase } from './supabase.js'

export async function getProductos(busqueda = '') {
  let query = supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (busqueda) {
    query = query.ilike('nombre', `%${busqueda}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getProducto(id) {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function crearProducto(producto) {
  const { data, error } = await supabase
    .from('productos')
    .insert(producto)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function editarProducto(id, cambios) {
  const { data, error } = await supabase
    .from('productos')
    .update(cambios)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function eliminarProducto(id) {
  const { error } = await supabase
    .from('productos')
    .update({ activo: false })
    .eq('id', id)
  if (error) throw error
}

export async function actualizarStock(id, cantidad) {
  const { data: producto, error: errGet } = await supabase
    .from('productos')
    .select('stock')
    .eq('id', id)
    .single()
  if (errGet) throw errGet

  const nuevoStock = producto.stock + cantidad
  if (nuevoStock < 0) throw new Error('Stock insuficiente')

  const { error } = await supabase
    .from('productos')
    .update({ stock: nuevoStock })
    .eq('id', id)
  if (error) throw error
  return nuevoStock
}