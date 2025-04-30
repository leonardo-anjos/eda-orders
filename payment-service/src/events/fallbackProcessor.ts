import { getChannel } from '../config/rabbitmq';
import { processPayment } from '../services/paymentProcessor';
import { publishPaymentProcessed } from './publisher';

const fallbackQueue = 'payment_fallback_queue';

export const reprocessFallbackQueue = async () => {
  const channel = getChannel();
  await channel.assertQueue(fallbackQueue, { durable: true });

  channel.consume(fallbackQueue, async (msg) => {
    if (msg) {
      const order = JSON.parse(msg.content.toString());

      try {
        console.log(`[payment-service] FALLBACK : reprocessing payment for order: ${order.id}`);

        const status = processPayment();

        const payment = {
          orderId: order.id,
          status,
          timestamp: new Date().toISOString()
        };

        await publishPaymentProcessed(payment);

        channel.ack(msg);
        console.log(`[payment-service] FALLBACK: successfully reprocessed payment for order: ${order.id}`);
      } catch (error) {
        console.error(`[payment-service] FALLBACK: failed to reprocess payment for order: ${order.id}`, error);
        channel.nack(msg, false, true);
      }
    }
  });
};