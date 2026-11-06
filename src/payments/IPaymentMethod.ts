export interface IPaymentMethod {
  // Nome usado no pedido (paymentMethod), ex.: "credit_card"
  readonly name: string;
  process(amount: number, details: any): void;
}
