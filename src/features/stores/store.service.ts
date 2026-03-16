import { supabase } from '../../lib/supabase'

export const getStores = async () => {

  const { data, error } = await supabase
    .from('stores')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data
}