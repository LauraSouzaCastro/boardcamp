import { db } from '../database/database.connection.js'

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`
        SELECT json_build_object(
            'id', rentals.id,
            'customerId', rentals."customerId",
            'gameId', rentals."gameId",
            'rentDate', rentals."rentDate",
            'daysRented', rentals."daysRented",
            'returnDate', rentals."returnDate",
            'originalPrice', rentals."originalPrice",
            'delayFee', rentals."delayFee",
            'customer', json_build_object(
                'id', customers.id,
                'name', customers.name
            ),
            'game', json_build_object(
                'id', games.id,
                'name', games.name
            )
        )
        FROM rentals
        JOIN customers
            ON rentals."customerId" = customers.id
        JOIN games
            ON rentals."gameId" = games.id;
    `)

    res.send(rentals.rows.map((r) => r.json_build_object))

  } catch (error) {
    res.status(500).send(error.message)
  }
}

export async function postRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body
  try {
    const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId])
    const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId])
    const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId])
    const rentedGames = rentals.rows.filter((r) => r.returnDate === null)
    
    if(game.rowCount === 0 || customer.rowCount === 0 || game.rows[0].stockTotal <= rentedGames.length){
      return res.sendStatus(400)
    }

    const rentDate = new Date()
    const originalPrice = daysRented*game.rows[0].pricePerDay

    await db.query(`
    INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice")
    VALUES ($1, $2, $3, $4, $5);`
      , [customerId, gameId, rentDate, daysRented, originalPrice])

    res.sendStatus(201)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export async function postRentalsReturn(req, res){
    const { id } = req.params
    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id])
        
        if(rental.rowCount === 0){
            return res.sendStatus(404)
        }else if(rental.rows[0].returnDate !== null){
            return res.sendStatus(400)
        }

        const game  = await db.query(`SELECT * FROM games WHERE id=$1;`, [rental.rows[0].gameId])

        const returnDate = new Date()
        const days = (parseInt(returnDate.getTime()/(1000 * 3600 * 24)) - (parseInt((rental.rows[0].rentDate).getTime()/(1000 * 3600 * 24))+rental.rows[0].daysRented))
        let delayFee
        if(days <= 0){
            delayFee = 0
        }else{
            delayFee = days*game.rows[0].pricePerDay
        }

        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id = $3;`, [returnDate, delayFee, id])
    
        res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
}

export async function deleteRentals(req, res){
    const { id } = req.params
    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id])
        
        if(rental.rowCount === 0){
            return res.sendStatus(404)
        }else if(rental.rows[0].returnDate === null){
            return res.sendStatus(400)
        }

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id])
    
        res.sendStatus(200)
    } catch (error) {
      res.status(500).send(error.message)
    }
}