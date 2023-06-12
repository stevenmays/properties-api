import Joi from 'joi';

export const createSchema = Joi.object({
  address: Joi.string().min(5).required(),
  price: Joi.number().required(),
  bedrooms: Joi.number().integer().min(1).required(),
  bathrooms: Joi.number().integer().min(1).required(),
  type: Joi.string()
    .valid('Condominium', 'Townhouse', 'SingleFamilyResidence')
    .required(),
});

export const updateSchema = Joi.object({
  address: Joi.string().min(5),
  price: Joi.number(),
  bedrooms: Joi.number().integer().min(1),
  bathrooms: Joi.number().integer().min(1),
  type: Joi.string().valid('Condominium', 'Townhouse', 'SingleFamilyResidence'),
});
