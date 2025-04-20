import { getChannel } from '../config/rabbitmq';
import { processPayment } from '../services/paymentProcessor';
import { publishPaymentProcessed } from './publisher';

export const consumeOrderCreated = async () => {
  const channel = getChannel();
  await channel.assertExchange('orders_exchange', 'fanout', { durable: true });
  const q = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(q.queue, 'orders_exchange', '');

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      const order = JSON.parse(msg.content.toString());
      const status = processPayment();

      const payment = {
        orderId: order.id,
        status,
        timestamp: new Date().toISOString()
      };

      await publishPaymentProcessed(payment);
      channel.ack(msg);
      console.log(`💰 Payment ${status.toUpperCase()} for Order ${order.id}`);
    }
  });
};