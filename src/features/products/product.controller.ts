import { Request, Response } from 'express'
import { getProducts } from './product.service'

export const getAllProducts = async (req: Request, res: Response) => {

  const products = await getProducts()

  res.json(products)

}