import Joi from 'joi';

export const createRateSchema = Joi.object({
  minAmount: Joi.number().min(0).required(),
  maxAmount: Joi.number().greater(Joi.ref('minAmount')).required(),
  rate: Joi.number().positive().required(),
});

export const updateRateSchema = Joi.object({
  minAmount: Joi.number().min(0),
  maxAmount: Joi.number().positive().greater(Joi.ref('minAmount')),
  rate: Joi.number().positive(),
}).min(1);

export const getRateSchema = Joi.object({
  amount: Joi.number().positive().required(),
});
