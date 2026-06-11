import { supabase } from './supabase.js'

export async function crearCotizacion(cliente, items, notas = '', venceDias = 7) {
  const total = items.reduce((s, i) => s + i.precio_unitario * i.cantidad, 0)
  const vence = new Date()
  vence.setDate(vence.getDate() + venceDias)

  const { data: cot, error: errCot } = await supabase
    .from('cotizaciones')
    .insert({ cliente: cliente || 'Sin nombre', total, notas, vence_en: vence.toISOString() })
    .select()
    .single()
  if (errCot) throw errCot

  const detalle = items.map(i => ({
    cotizacion_id:   cot.id,
    producto_id:     i.producto_id,
    nombre_producto: i.nombre,
    cantidad:        i.cantidad,
    precio_unitario: i.precio_unitario,
    subtotal:        i.precio_unitario * i.cantidad
  }))

  const { error: errDet } = await supabase.from('detalle_cotizaciones').insert(detalle)
  if (errDet) throw errDet

  return cot
}

export async function getCotizaciones() {
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('*, detalle_cotizaciones(*)')
    .order('creado_en', { ascending: false })
  if (error) throw error
  return data
}

export async function getCotizacion(id) {
  const { data, error } = await supabase
    .from('cotizaciones')
    .select('*, detalle_cotizaciones(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function actualizarEstado(id, estado) {
  const { error } = await supabase
    .from('cotizaciones')
    .update({ estado })
    .eq('id', id)
  if (error) throw error
}

export async function eliminarCotizacion(id) {
  const { error } = await supabase
    .from('cotizaciones')
    .delete()
    .eq('id', id)
  if (error) throw error
}