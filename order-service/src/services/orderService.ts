import { publishOrderCreated } from '../events/publisher';

export async function createOrder(data: any) {
  const order = {
    id: Date.now().toString(),
    items: data.items,
    userId: data.userId,
    total: data.total,
    status: 'created'
  };

  await publishOrderCreated(order);
  return order;
}
