import { db } from '../database/database.connection.js'

export async function getCustomers(req, res) {
    try {
        const customers = await db.query("SELECT * FROM customers")

        res.send(customers.rows)

    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function getCustomersById(req, res) {
    const { id } = req.params
    try {
        const customers = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id])
        if(customers.rowCount === 0) return res.sendStatus(404)
        res.send(customers.rows[0])
  
    } catch (error) {
      res.status(500).send(error.message)
    }
}

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body
    try {
        const customers = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf])
        if(customers.rowCount !== 0){
        return res.sendStatus(409)
        }
        await db.query(`
        INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4);`
        , [name, phone, cpf, birthday])

        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function putCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body
    const { id } = req.params
    try {
      const customers = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf])

      if(customers.rowCount !== 0){
        if(customers.rows[0].id !== Number(id)){
            return res.sendStatus(409)
        }
      }
      
      await db.query(`UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5;`, [name, phone, cpf, birthday, id])
  
      res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
  }