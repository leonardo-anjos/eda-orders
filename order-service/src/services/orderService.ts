import { v4 as uuidv4 } from 'uuid';
import { publishOrderCreated } from '../events/publisher';

export async function createOrder(data: any) {
  const order = {
    id: uuidv4(),
    items: data.items,
    userId: data.userId,
    total: data.total,
    status: 'created'
  };

  await publishOrderCreated(order);

  return order;
}
