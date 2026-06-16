import { supabase } from './supabase.js'
import { getUsuarioCache } from './auth.js'

export async function crearVenta(cliente, items, descuento = 0, tipoPago = 'efectivo', telefono = '') {
  const u = await getUsuarioCache()
  const total = items.reduce((s, i) => s + i.precio_unitario * i.cantidad, 0) - descuento
  const { data: venta, error: errVenta } = await supabase
    .from('ventas')
    .insert({ cliente: cliente || 'Cliente general', total, descuento, tipo_pago: tipoPago, telefono: telefono || null, tienda_id: u.tienda_id })
    .select().single()
  if (errVenta) throw errVenta
  const detalle = items.map(i => ({
    venta_id: venta.id, producto_id: i.producto_id,
    nombre_producto: i.nombre, cantidad: i.cantidad,
    precio_unitario: i.precio_unitario, costo_unitario: i.costo_unitario,
    subtotal: i.precio_unitario * i.cantidad
  }))
  const { error: errDet } = await supabase.from('detalle_ventas').insert(detalle)
  if (errDet) throw errDet
  for (const item of items) {
    const { data: prod } = await supabase.from('productos').select('stock').eq('id', item.producto_id).single()
    await supabase.from('productos').update({ stock: prod.stock - item.cantidad }).eq('id', item.producto_id)
  }
  return venta
}

export async function getVentas(limite = 100) {
  const { data, error } = await supabase
    .from('ventas').select('*, detalle_ventas(*)')
    .order('creado_en', { ascending: false }).limit(limite)
  if (error) throw error
  return data
}

export async function getVentasPorPeriodo(desde, hasta) {
  const { data, error } = await supabase
    .from('ventas').select('*, detalle_ventas(*)')
    .gte('creado_en', desde.toISOString()).lte('creado_en', hasta.toISOString())
    .order('creado_en', { ascending: false })
  if (error) throw error
  return data
}

export async function getVenta(id) {
  const { data, error } = await supabase
    .from('ventas').select('*, detalle_ventas(*)').eq('id', id).single()
  if (error) throw error
  return data
}