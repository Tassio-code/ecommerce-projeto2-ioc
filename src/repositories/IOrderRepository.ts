export interface IOrderRepository {
    create(data: {customer: string; items: any[]; total: number}): Promise<{id: number}>;
}