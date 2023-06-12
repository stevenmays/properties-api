import express from 'express';
import { propertyRoutes } from './routes';
import { errorHandler } from './middleware/errors-handler';

const app = express();
app.use('/properties', propertyRoutes);

// Custom error handler
app.use(errorHandler);

export default app;
