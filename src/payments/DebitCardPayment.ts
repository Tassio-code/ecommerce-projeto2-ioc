import { injectable } from 'inversify';
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

@injectable()
export class DebitCardPayment implements IPaymentMethod {
  readonly name = 'debit_card';

  process(amount: number, details: any): void {
    logger.info('Processando débito...');
  }
}
