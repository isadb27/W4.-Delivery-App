import { supabase } from '../../lib/supabase'

export const createOrder = async (items: any[], total: number) => {

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        total: total
      }
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  const order = data![0]

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

export const getOrders = async () => {

  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      total,
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