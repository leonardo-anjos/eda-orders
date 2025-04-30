import { connectRabbitMQ } from './config/rabbitmq';
import { consumeOrderCreated } from './events/consumer';
import { reprocessFallbackQueue } from './events/fallbackProcessor';

(async () => {
  try {
    await connectRabbitMQ();
    await consumeOrderCreated();
    await reprocessFallbackQueue();
    console.log('[processor] payment-service UP');
  } catch (error) {
    console.error('[processor] payment-service DOWN', error);
  }
})();
