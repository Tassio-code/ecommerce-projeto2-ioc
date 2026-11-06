import { Container } from 'inversify';
import { TYPES } from './types';

// Este é o ÚNICO arquivo que conhece as classes concretas.
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { ConsoleMailProvider } from '../providers/ConsoleMailProvider';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { NotificationService } from '../services/NotificationService';
import { OrderService } from '../services/OrderService';
import { OrderController } from '../controllers/OrderController';

import type { IMailProvider } from '../providers/IMailProvider';
import type { IOrderRepository } from '../repositories/IOrderRepository';
import type { IProductRepository } from '../repositories/IProductRepository';
import type { IPaymentMethod } from '../payments/IPaymentMethod';

export function buildContainer(env: string = process.env.APP_ENV ?? 'dev'): Container {
  const container = new Container();

  // A única decisão que depende do modo: e-mail e repositório de pedidos.
  if (env === 'dev') {
    container.bind<IMailProvider>(TYPES.MailProvider).to(EtherealMailProvider).inSingletonScope();
    container.bind<IOrderRepository>(TYPES.OrderRepository).to(PrismaOrderRepository).inSingletonScope();
  } else if (env === 'test') {
    container.bind<IMailProvider>(TYPES.MailProvider).to(ConsoleMailProvider).inSingletonScope();
    container.bind<IOrderRepository>(TYPES.OrderRepository).to(InMemoryOrderRepository).inSingletonScope();
  } else {
    throw new Error(`APP_ENV inválido: "${env}". Use "dev" ou "test".`);
  }

  // O resto é igual nos dois modos.
  container.bind<IProductRepository>(TYPES.ProductRepository).to(PrismaProductRepository).inSingletonScope();

  // Todas as formas de pagamento usam o mesmo rótulo; o registro recebe a lista inteira.
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(CreditCardPayment);
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(DebitCardPayment);
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(PixPayment);
  container.bind<PaymentMethodRegistry>(TYPES.PaymentMethodRegistry).to(PaymentMethodRegistry).inSingletonScope();

  container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
  container.bind<OrderService>(TYPES.OrderService).to(OrderService);
  container.bind<OrderController>(TYPES.OrderController).to(OrderController);

  return container;
}

export const container = buildContainer();
