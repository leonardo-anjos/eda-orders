import { connectRabbitMQ } from './utils/rabbitmq';
import { consumeOrderCreated } from './consumers/order-created.consumer';
import { consumePaymentEvents } from './consumers/payment-events.consumer';

(async () => {
  try {
    const { channel } = await connectRabbitMQ();
    await consumeOrderCreated(channel);
    await consumePaymentEvents(channel);
    console.log('[worker] notification-service UP');
  } catch (error) {
    console.error('[worker] notification-service DOWN', error);
  }
})();
