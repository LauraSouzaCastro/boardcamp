import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const joi = BaseJoi.extend(JoiDate);

export const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(/^\d+$/).min(10).max(11).required(),
    cpf: joi.string().pattern(/^\d+$/).length(11).required(),
    birthday: joi.date().format('YYYY-MM-DD').required()
});