import { injectable, multiInject } from 'inversify';
import { TYPES } from '../container/types';
import { IPaymentMethod } from './IPaymentMethod';

// Recebe TODAS as formas de pagamento registradas com o rótulo TYPES.PaymentMethod
// e permite buscar cada uma pelo nome. Nova forma de pagamento = nova classe + 1 linha no container.
@injectable()
export class PaymentMethodRegistry {
  private methods = new Map<string, IPaymentMethod>();

  constructor(@multiInject(TYPES.PaymentMethod) methods: IPaymentMethod[]) {
    for (const method of methods) {
      this.methods.set(method.name, method);
    }
  }

  get(name: string): IPaymentMethod | undefined {
    return this.methods.get(name);
  }
}
