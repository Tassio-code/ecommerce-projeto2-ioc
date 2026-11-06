import { injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { IProductRepository } from './IProductRepository';

const prisma = new PrismaClient();

@injectable()
export class PrismaProductRepository implements IProductRepository {
  async findById(id: number) {
    return await prisma.product.findUnique({ where: { id } });
  }
}
