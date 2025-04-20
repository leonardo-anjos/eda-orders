import amqplib from 'amqplib';

export async function connectRabbitMQ() {
  const connection = await amqplib.connect('amqp://localhost');
  const channel = await connection.createChannel();
  return { connection, channel };
}
