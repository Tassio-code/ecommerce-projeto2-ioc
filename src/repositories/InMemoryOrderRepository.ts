import { injectable } from 'inversify';
import { IOrderRepository } from './IOrderRepository';

type StoredOrder = {
  id: number;
  customer: string;
  items: any[];
  total: number;
  status: string;
};

// Modo "test": guarda os pedidos num array, sem banco de dados.
@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: StoredOrder[] = [];
  private nextId = 1;

  async create(data: { customer: string; items: any[]; total: number }) {
    const order: StoredOrder = { id: this.nextId++, ...data, status: 'confirmed' };
    this.orders.push(order);
    return order;
  }
}
