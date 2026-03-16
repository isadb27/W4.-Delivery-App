import { Request, Response } from 'express'
import { getStores } from './store.service'

export const getAllStores = async (req: Request, res: Response) => {

  const stores = await getStores()

  res.json(stores)

}