import { supabase } from '../../lib/supabase'

// crear orden (actualizado con status y destination)
export const createOrder = async (items: any[], total: number) => {

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        total: total,
        status: "Creado"
      }
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  const order = data![0]

  // insertar productos
  for (const item of items) {

    await supabase
      .from('order_items')
      .insert([
        {
          order_id: order.id,
          product_id: item.id,
          quantity: 1
        }
      ])
  }

  return order
}

// Obtener órdenes (igual pero listo)
export const getOrders = async () => {

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      total,
      status,
      order_items (
        quantity,
        products (
          name
        )
      )
    `)

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Aceptar orden (PATCH)
export const acceptOrder = async (id: string) => {

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "En entrega" })
    .eq("id", id)
    .select()

  if (error) throw new Error(error.message)

  return data[0]
}

// Actualizar posición (PATCH)
export const updatePosition = async (id: string, lat: number, lng: number) => {

  const point = `POINT(${lng} ${lat})`

  const { data, error } = await supabase
    .from("orders")
    .update({
      delivery_position: point
    })
    .eq("id", id)
    .select()

  if (error) throw new Error(error.message)

  return data[0]
}