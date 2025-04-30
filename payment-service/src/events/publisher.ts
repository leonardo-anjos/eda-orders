import { getChannel } from '../config/rabbitmq';
import { Payment } from '../models/payment';

const exchange = 'payments_exchange';

export const publishPaymentProcessed = async (payment: Payment) => {
  const channel = getChannel();

  await channel.assertExchange(exchange, 'fanout', { durable: true });

  const message = Buffer.from(JSON.stringify(payment));
  channel.publish(exchange, '', message);
  console.log(`[new payment] order ${payment.orderId} - status ${payment.status.toUpperCase()}`);
};