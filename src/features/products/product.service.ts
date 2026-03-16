import { supabase } from '../../lib/supabase'
import { Product } from './product.types'

export const getProducts = async (): Promise<Product[]> => {

  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data as Product[]
}