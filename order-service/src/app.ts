import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/orders';

const app = express();

// middleware
app.use(bodyParser.json());

// routes
app.use('/orders', orderRoutes);

// health check
app.get('/', (req, res) => {
  res.send('order-service is running!');
});

export default app;
