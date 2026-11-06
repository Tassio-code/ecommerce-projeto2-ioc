import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { TYPES } from '../container/types';
import { OrderService } from '../services/OrderService';
import { OrderValidationError } from '../services/OrderValidationError';
import logger from '../lib/logger';

@injectable()
export class OrderController {
  constructor(@inject(TYPES.OrderService) private orderService: OrderService) {}

  async processOrder(req: Request, res: Response) {
    try {
      const result = await this.orderService.processOrder(req.body);

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview
      });
    } catch (error: any) {
      if (error instanceof OrderValidationError) {
        return res.status(400).json({ error: error.message });
      }
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}
