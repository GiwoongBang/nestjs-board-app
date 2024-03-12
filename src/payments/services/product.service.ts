import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProductsByIds(productIds: string[]): Promise<Product[]> {
    return await this.productRepository.getProductsByIds(productIds);
  }
}
