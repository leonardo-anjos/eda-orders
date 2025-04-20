import { getChannel } from '../config/rabbitmq';
import { Payment } from '../models/payment';

export const publishPaymentProcessed = async (payment: Payment) => {
  const channel = getChannel();

  // Assegura que o exchange 'payments_exchange' existe
  await channel.assertExchange('payments_exchange', 'fanout', { durable: true });

  const message = Buffer.from(JSON.stringify(payment));
  channel.publish('payments_exchange', '', message);
  console.log(`[x] Payment processed event published: ${message.toString()}`);
};