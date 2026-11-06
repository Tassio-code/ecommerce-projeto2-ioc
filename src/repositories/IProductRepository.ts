export interface IProductRepository {
  findById(id: number): Promise<any | null>;
}