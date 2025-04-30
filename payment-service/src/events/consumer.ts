import { getChannel } from '../config/rabbitmq';
import { processPayment } from '../services/paymentProcessor';
import { publishPaymentProcessed } from './publisher';

const exchange = 'orders_exchange';
const fallbackQueue = 'payment_fallback_queue';

export const consumeOrderCreated = async () => {
  const channel = getChannel();
  await channel.assertExchange(exchange, 'fanout', { durable: true });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.assertQueue(fallbackQueue, { durable: true }); // Fallback queue
  channel.bindQueue(q.queue, exchange, '');

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      const order = JSON.parse(msg.content.toString());

      try {
        const status = processPayment();

        const payment = {
          orderId: order.id,
          status,
          timestamp: new Date().toISOString()
        };

        await publishPaymentProcessed(payment);
        channel.ack(msg);
      } catch (error) {
        console.error('[payment-service] Payment processing failed:', error);

        // send the message to the fallback queue
        channel.sendToQueue(fallbackQueue, Buffer.from(msg.content));
        channel.ack(msg); // ack the original message
      }
    }
  });
};