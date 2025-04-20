import { Channel } from 'amqplib';

export async function consumeOrderCreated(channel: Channel) {
  const exchange = 'orders_exchange';
  const routingKey = 'order.created';

  await channel.assertExchange(exchange, 'fanout', { durable: true });

  const { queue } = await channel.assertQueue('', { exclusive: true });

  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, (msg) => {
    if (msg) {
      const data = JSON.parse(msg.content.toString());
      console.log('📢 Notification: Order created for user', data.userId);
      channel.ack(msg);
    }
  });

  console.log(`🎧 Listening to ${routingKey} on exchange ${exchange}`);
}