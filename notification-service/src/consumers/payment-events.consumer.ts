import { Channel, ConsumeMessage } from 'amqplib';

type PaymentEvent = {
  orderId: string;
  status: string;
  timestamp: number;
};

export async function consumePaymentEvents(channel: Channel) {
  const exchange = 'payments_exchange';

  await channel.assertExchange(exchange, 'fanout', { durable: true });

  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, exchange, '');

  channel.consume(queue, (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const data: PaymentEvent = JSON.parse(msg.content.toString());
      console.log(`[notification-service]: PAYMENT: order ${data.orderId} - status ${data.status.toUpperCase()}`);

      // send emal, push, SMS, etc.

      channel.ack(msg);
    } catch (err) {
      console.error('[notification-service] failed notification payment', err);
      // reprocess message (nack) or ignore (ack)
      // channel.nack(msg, false, false);
    }
  });
}
