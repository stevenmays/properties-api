import express from 'express';
import bodyParser from 'body-parser';
import * as PropertyController from '../controllers/property';
import * as ProperyValidation from '../validation/property';

export const propertyRoutes = express.Router();

propertyRoutes.use(bodyParser.json());

propertyRoutes.get('/', async (req, res, next) => {
  let response;
  try {
    response = await PropertyController.list(req.query);
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }

  res.status(200).json(response);
});

propertyRoutes.get('/:id', async (req, res, next) => {
  try {
    const response = await PropertyController.get({ id: req.params?.id });

    if (!response) {
      return res.status(404).send({}).json();
    }

    res.status(200).send(response).json();
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});

propertyRoutes.post('/', async (req, res, next) => {
  try {
    const { error } = ProperyValidation.createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const response = await PropertyController.create(req.body);
    res.status(200).send(response).json();
  } catch {
    next();
  }
});

propertyRoutes.put('/:id', async (req, res, next) => {
  try {
    const { error } = ProperyValidation.updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const response = await PropertyController.update(req.params?.id, req.body);

    if (!response) {
      return res.status(404).send({}).json();
    }

    res.status(200).send(response).json();
  } catch {
    next();
  }
});

propertyRoutes.delete('/:id', async (req, res, next) => {
  try {
    const response = await PropertyController.deleteOne({ id: req.params?.id });

    if (!Number.isInteger(response?.affected) || response?.affected === 0) {
      return res.status(404).send({}).json();
    }

    res.status(204).send({}).json();
  } catch (error) {
    // Pass the error to the error handling middleware
    next(error);
  }
});
