import { injectable } from 'inversify';
import { IPaymentMethod } from './IPaymentMethod';
import logger from '../lib/logger';

@injectable()
export class PixPayment implements IPaymentMethod {
  readonly name = 'pix';

  process(amount: number, details: any): void {
    logger.info('Processando pagamento via Pix...');
  }
}
