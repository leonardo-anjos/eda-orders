import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const conn = await amqp.connect('amqp://localhost');
  channel = await conn.createChannel();
  return channel;
};

export const getChannel = () => channel;
