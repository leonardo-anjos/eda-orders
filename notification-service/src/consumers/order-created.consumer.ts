import { Channel, ConsumeMessage } from 'amqplib';

type OrderCreatedEvent = {
  id: string;
  userId: string;
  itens: any[];
  total: number;
  status: string;
};

export async function consumeOrderCreated(channel: Channel) {
  const exchange = 'orders_exchange';
  const routingKey = 'order.created';

  await channel.assertExchange(exchange, 'fanout', { durable: true });

  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, exchange, routingKey);

  channel.consume(queue, (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const data: OrderCreatedEvent = JSON.parse(msg.content.toString());
      console.log(`[notification-service] ORDER: order ${data.id} - user ${data.userId}`);

      // send emal, push, SMS, etc.

      channel.ack(msg);
    } catch (err) {
      console.error('[notification-service] failed notification order:', err);
      // reprocess message (nack) or ignore (ack)
      channel.nack(msg, false, false);
    }
  });
}
