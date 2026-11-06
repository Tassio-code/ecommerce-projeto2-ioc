import {Product } from "./IProduct";

export class PhysicalProduct implements Product {
  constructor(
    public id: number,
    public name: string,
    public price: number,
  ) {}  
  calculateFreight(): number {
    return 10; // Exemplo de cálculo de frete para produtos físicos }
  }
}