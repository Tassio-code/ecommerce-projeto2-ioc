import { injectable } from 'inversify';
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

@injectable()
export class CreditCardPayment implements IPaymentMethod {
  readonly name = 'credit_card';

  process(amount: number, details: any): void {
    logger.info(`Processando cartão final ${details.cardNumber.slice(-4)}`);
    if (details.cvv === '000') throw new Error('Pagamento recusado');
  }
}
