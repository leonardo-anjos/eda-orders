import { v4 as uuidv4 } from 'uuid';
import { publishOrderCreated } from '../events/publisher';

type CreateOrderInput = {
  userId: string;
  items: string[];
  total: number;
};

type Order = {
  id: string;
  userId: string;
  items: string[];
  total: number;
  status: 'created';
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim() !== '';
}

function isValidItems(items: unknown): items is string[] {
  return Array.isArray(items) && items.every(isNonEmptyString);
}

export async function createOrder(data: any): Promise<Order> {
  const { userId, items, total } = data;

  if (!isNonEmptyString(userId)) {
    throw new Error('invalid or missing userId');
  }

  if (!isValidItems(items)) {
    throw new Error('invalid or missing items. Must be a non-empty array of strings.');
  }

  const numericTotal = typeof total === 'string' ? parseFloat(total) : total;
  if (typeof numericTotal !== 'number' || isNaN(numericTotal) || numericTotal <= 0) {
    throw new Error('invalid or missing total. Must be a positive number.');
  }

  const order: Order = {
    id: uuidv4(),
    userId,
    items,
    total: numericTotal,
    status: 'created',
  };

  try {
    await publishOrderCreated(order);
  } catch (error) {
    console.error('failed to publish order event:', error);
    throw new Error('failed to create order');
  }

  return order;
}
