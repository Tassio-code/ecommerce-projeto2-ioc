import { Product } from './IProduct';
export class DigitalProduct implements Product {
  constructor(
    public id: number,
    public name: string,
    public price: number,
  ) {}

calculateFreight(): number {
    return 0; // Produtos digitais não possuem frete
    }
}