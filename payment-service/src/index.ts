import { connectRabbitMQ } from './config/rabbitmq';
import { consumeOrderCreated } from './events/consumer';

(async () => {
  try {
    await connectRabbitMQ();
    await consumeOrderCreated();
    console.log('[processor] payment-service UP');
  } catch (error) {
    console.error('[processor] payment-service DOWN', error);
  }
})();
