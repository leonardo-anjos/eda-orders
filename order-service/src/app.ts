import express from 'express';
import bodyParser from 'body-parser';
import orderRoutes from './routes/orders';

const app = express();

app.use(bodyParser.json());

app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('order-service is running!');
});

export default app;
