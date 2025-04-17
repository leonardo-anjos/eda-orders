import amqp from 'amqplib';

let conn: any = null;
let ch: any = null;
const exchange = 'order_exchange';

async function initializeRabbitMQ() {
  if (!conn) {
    conn = await amqp.connect('amqp://localhost');
    ch = await conn.createChannel();
    await ch.assertExchange(exchange, 'fanout', { durable: true });
    console.log('[x] RabbitMQ connection and channel initialized');
  }
}

export async function publishOrderCreated(order: any) {
  try {
    if (!ch) {
      await initializeRabbitMQ();
    }

    const message = JSON.stringify(order);
    ch!.publish(exchange, '', Buffer.from(message));
    console.log('[x] orderCreated event published:', message);
  } catch (error) {
    console.error('[!] error publishing orderCreated event:', error);
  }
}

process.on('exit', async () => {
  if (ch) {
    await ch.close();
    console.log('[x] RabbitMQ channel closed');
  }
  if (conn) {
    await conn.close();
    console.log('[x] RabbitMQ connection closed');
  }
});