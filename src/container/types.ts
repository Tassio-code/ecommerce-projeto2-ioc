// Um Symbol é um rótulo único. Cada dependência do container tem o seu.
export const TYPES = {
  MailProvider: Symbol.for('MailProvider'),
  OrderRepository: Symbol.for('OrderRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  PaymentMethod: Symbol.for('PaymentMethod'),
  PaymentMethodRegistry: Symbol.for('PaymentMethodRegistry'),
  NotificationService: Symbol.for('NotificationService'),
  OrderService: Symbol.for('OrderService'),
  OrderController: Symbol.for('OrderController'),
};
