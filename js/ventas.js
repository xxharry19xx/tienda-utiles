import { supabase } from './supabase.js'

export async function crearVenta(cliente, items, descuento = 0) {
  // items = [{ producto_id, nombre, cantidad, precio_unitario, costo_unitario }]
    const total = items.reduce((s, i) => s + i.precio_unitario * i.cantidad, 0) - descuento

      // 1. Insertar cabecera de venta
        const { data: venta, error: errVenta } = await supabase
            .from('ventas')
                .insert({ cliente: cliente || 'Cliente general', total, descuento })
                    .select()
                        .single()
                          if (errVenta) throw errVenta

                            // 2. Insertar detalle
                              const detalle = items.map(i => ({
                                  venta_id:        venta.id,
                                      producto_id:     i.producto_id,
                                          nombre_producto: i.nombre,
                                              cantidad:        i.cantidad,
                                                  precio_unitario: i.precio_unitario,
                                                      costo_unitario:  i.costo_unitario,
                                                          subtotal:        i.precio_unitario * i.cantidad
                                                            }))

                                                              const { error: errDet } = await supabase.from('detalle_ventas').insert(detalle)
                                                                if (errDet) throw errDet

                                                                  // 3. Descontar stock de cada producto
                                                                    for (const item of items) {
                                                                        const { data: prod } = await supabase
                                                                              .from('productos')
                                                                                    .select('stock')
                                                                                          .eq('id', item.producto_id)
                                                                                                .single()

                                                                                                    await supabase
                                                                                                          .from('productos')
                                                                                                                .update({ stock: prod.stock - item.cantidad })
                                                                                                                      .eq('id', item.producto_id)
                                                                                                                        }

                                                                                                                          return venta
                                                                                                                          }

                                                                                                                          export async function getVentas(limite = 20) {
                                                                                                                            const { data, error } = await supabase
                                                                                                                                .from('ventas')
                                                                                                                                    .select('*, detalle_ventas(*)')
                                                                                                                                        .order('creado_en', { ascending: false })
                                                                                                                                            .limit(limite)
                                                                                                                                              if (error) throw error
                                                                                                                                                return data
                                                                                                                                                }

                                                                                                                                                export async function getVenta(id) {
                                                                                                                                                  const { data, error } = await supabase
                                                                                                                                                      .from('ventas')
                                                                                                                                                          .select('*, detalle_ventas(*)')
                                                                                                                                                              .eq('id', id)
                                                                                                                                                                  .single()
                                                                                                                                                                    if (error) throw error
                                                                                                                                                                      return data
                                                                                                                                                                      }