import joi from "joi";

export const rentalsSchema = joi.object({
    daysRented: joi.number().integer().min(1).required(),
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required()
});