import { Product } from "./IProduct";
import { PhysicalProduct } from "./PhysicalProduct";
import { DigitalProduct } from "./DigitalProduct";

export class ProductFactory {
    static createProduct(data: any): Product {
        if (data.type === 'physical') {
            return new PhysicalProduct(data.id, data.name, data.price);
        } else if (data.type === 'digital') {
            return new DigitalProduct(data.id, data.name, data.price);
        }
        throw new Error('Tipo de produto não suportado');
    }
    }