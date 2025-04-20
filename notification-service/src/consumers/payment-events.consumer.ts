import { Channel } from 'amqplib';

export async function consumePaymentEvents(channel: Channel) {
  const exchange = 'payments_exchange';

  await channel.assertExchange(exchange, 'fanout', { durable: true });

  const { queue } = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(queue, exchange, '');

  channel.consume(queue, (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log(`📢 Notification: Payment event received for order ${data.orderId}`);
      channel.ack(msg);
    }
  });

  console.log(`🎧 Listening for payment events on exchange ${exchange}`);
}