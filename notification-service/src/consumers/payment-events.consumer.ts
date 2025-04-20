import { Channel } from 'amqplib';

export async function consumePaymentEvents(channel: Channel) {
  const queues = ['payment.approved', 'payment.rejected'];

  for (const queue of queues) {
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        console.log(`📢 Notificação: Pagamento ${queue.includes('approved') ? 'aprovado' : 'rejeitado'} para pedido ${data.orderId}`);
        channel.ack(msg);
      }
    });
  }
}
