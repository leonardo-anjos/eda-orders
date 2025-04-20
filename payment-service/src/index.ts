import { connectRabbitMQ } from './config/rabbitmq';
import { consumeOrderCreated } from './events/consumer';

(async () => {
  try {
    await connectRabbitMQ();
    await consumeOrderCreated();
    console.log('✅ Payment Service is running');
  } catch (error) {
    console.error('❌ Error starting payment service:', error);
  }
})();
