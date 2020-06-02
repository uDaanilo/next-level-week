import knex from '../db/connection'
import { Request, Response } from 'express'

class ItemsController {
  async index(req: Request, res: Response){
    const items = await knex('items').select()

    const serializedItems = items.map(item => {
      return {
        ...item,
        image_url: `http://localhost:3000/uploads/${item.image}`
      }
    })

    return res.json(serializedItems)
  }

  async create(req: Request, res: Response){

  }

  async update(req: Request, res: Response){

  }
  
  async delete(req: Request, res: Response){

  }
}

export default ItemsController