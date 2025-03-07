import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export default (schema: Joi.ObjectSchema, property: 'body' | 'query' | 'params') =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
