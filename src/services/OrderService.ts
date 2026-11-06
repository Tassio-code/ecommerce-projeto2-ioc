import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { ProductFactory } from '../domain/ProductFactory';
import { NotificationService } from './NotificationService';
import { OrderValidationError } from './OrderValidationError';
import logger from '../lib/logger';

@injectable()
export class OrderService {
  constructor(
    @inject(TYPES.ProductRepository) private productRepository: IProductRepository,
    @inject(TYPES.OrderRepository) private orderRepository: IOrderRepository,
    @inject(TYPES.PaymentMethodRegistry) private paymentMethods: PaymentMethodRegistry,
    @inject(TYPES.NotificationService) private notificationService: NotificationService
  ) {}

  async processOrder(input: {
    customer: string;
    items: any[];
    paymentMethod: string;
    paymentDetails: any;
  }) {
    const { customer, items, paymentMethod, paymentDetails } = input;

    if (!items || items.length === 0) {
      logger.error('Erro: Nenhum item no pedido');
      throw new OrderValidationError('Carrinho vazio');
    }

    let totalAmount = 0;
    const productsDetails: any[] = [];

    for (const item of items) {
      const data = await this.productRepository.findById(item.productId);

      if (!data) {
        throw new OrderValidationError(`Produto com ID ${item.productId} não encontrado`);
      }

      const product = ProductFactory.createProduct(data);
      totalAmount += product.price * item.quantity;
      totalAmount += product.calculateFreight();

      productsDetails.push({ ...data, quantity: item.quantity });
    }

    const payment = this.paymentMethods.get(paymentMethod);

    if (!payment) {
      throw new OrderValidationError(`Método de pagamento ${paymentMethod} não suportado`);
    }
    payment.process(totalAmount, paymentDetails);

    const order = await this.orderRepository.create({
      customer,
      items: productsDetails,
      total: totalAmount
    });

    const emailPreview = await this.notificationService.sendOrderConfirmation(
      customer,
      order.id,
      totalAmount,
      productsDetails.map(p => p.name)
    );

    return { orderId: order.id, emailPreview };
  }
}
