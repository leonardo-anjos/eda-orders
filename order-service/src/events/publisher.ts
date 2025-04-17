import amqp from 'amqplib';

export async function publishOrderCreated(order: any) {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  const exchange = 'order_exchange';

  await ch.assertExchange(exchange, 'fanout', { durable: true });

  const message = JSON.stringify(order);
  ch.publish(exchange, '', Buffer.from(message));
  console.log('[x] orderCreated event published:', message);

  setTimeout(() => {
    ch.close();
    conn.close();
  }, 500);
}
