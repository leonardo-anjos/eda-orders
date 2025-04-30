import express from 'express';
import orderRoutes from './routes/orders';

const app = express();

app.use(express.json());

app.use('/orders', orderRoutes);

export default app;
