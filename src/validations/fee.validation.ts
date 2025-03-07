import Joi from 'joi';

export const createFeeSchema = Joi.object({
  minAmount: Joi.number().min(0).required(),
  maxAmount: Joi.number().greater(Joi.ref('minAmount')).required(),
  fee: Joi.number().positive().required(),
});

export const updateFeeSchema = Joi.object({
  minAmount: Joi.number().min(0),
  maxAmount: Joi.number().positive().greater(Joi.ref('minAmount')),
  fee: Joi.number().positive(),
}).min(1);

export const calculateFeeSchema = Joi.object({
  amount: Joi.number().positive().required(),
});
