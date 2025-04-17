import express from 'express';
import { createOrder } from '../services/orderService';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'error creating order' });
  }
});

export default router;
