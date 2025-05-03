import CircuitBreaker from 'opossum';
import { getChannel } from '../config/rabbitmq';
import { processPayment } from '../services/paymentProcessor';
import { publishPaymentProcessed } from './publisher';

const exchange = 'orders_exchange';
const fallbackQueue = 'payment_fallback_queue';

const breakerOptions = {
  timeout: 5000, // 5 seconds
  errorThresholdPercentage: 50, // open circuit if 50% of requests fail
  resetTimeout: 10000 // try again after 10 seconds
};

const paymentBreaker = new CircuitBreaker(processPayment, breakerOptions);

export const consumeOrderCreated = async () => {
  const channel = getChannel();
  await channel.assertExchange(exchange, 'fanout', { durable: true });
  const q = await channel.assertQueue('', { exclusive: true });
  await channel.assertQueue(fallbackQueue, { durable: true });
  channel.bindQueue(q.queue, exchange, '');

  channel.consume(q.queue, async (msg) => {
    if (msg) {
      const order = JSON.parse(msg.content.toString());

      try {
        const status = await paymentBreaker.fire();

        const payment = {
          orderId: order.id,
          status,
          timestamp: new Date().toISOString()
        };

        await publishPaymentProcessed(payment);
        channel.ack(msg);
      } catch (error) {
        console.error('[payment-service] Circuit breaker triggered or payment failed:', error);

        // Send the message to the fallback queue
        channel.sendToQueue(fallbackQueue, Buffer.from(msg.content));
        channel.ack(msg); // Acknowledge the original message
      }
    }
  });
};