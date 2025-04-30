import amqp from 'amqplib';

let conn: any = null;
let ch: any = null;
const exchange = 'orders_exchange';

async function initializeRabbitMQ() {
  if (!conn) {
    conn = await amqp.connect('amqp://localhost');
    ch = await conn.createChannel();
    await ch.assertExchange(exchange, 'fanout', { durable: true });
  }
}

export async function publishOrderCreated(order: any) {
  try {
    if (!ch) {
      await initializeRabbitMQ();
    }

    const message = JSON.stringify(order);
    ch!.publish(exchange, '', Buffer.from(message));
    console.log('[new order]', order.id);
  } catch (error) {
    console.error('[order error]:', error);
  }
}

process.on('exit', async () => {
  if (ch) {
    await ch.close();
    console.log('[rabbitmq] channel closed');
  }
  if (conn) {
    await conn.close();
    console.log('[rabbitmq] connection closed');
  }
});