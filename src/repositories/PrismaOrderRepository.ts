import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';

const prisma = new PrismaClient();

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
  async create(data: { customer: string; items: any[]; total: number }) {
    return await prisma.order.create({
      data: {
        customer: data.customer,
        items: JSON.stringify(data.items),
        total: data.total,
        status: 'confirmed'
      }
    });
  }
}
