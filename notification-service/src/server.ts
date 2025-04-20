import { connectRabbitMQ } from './utils/rabbitmq';
import { consumeOrderCreated } from './consumers/order-created.consumer';
import { consumePaymentEvents } from './consumers/payment-events.consumer';

(async () => {
  const { channel } = await connectRabbitMQ();
  await consumeOrderCreated(channel);
  await consumePaymentEvents(channel);
  console.log('✅ Notification Service is running and listening to events...');
})();
