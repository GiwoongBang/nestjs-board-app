import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { ShippingInfo } from '../entities/shipping-info.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ShippingInfoRepository extends Repository<ShippingInfo> {
  constructor(
    @InjectRepository(ShippingInfo)
    private readonly repo: Repository<ShippingInfo>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async createShippingInfo(shippingAddress: string): Promise<ShippingInfo> {
    const shippingInfo = new ShippingInfo();
    shippingInfo.address = shippingAddress;
    shippingInfo.status = 'ordered';
    return this.entityManager.save(shippingInfo);
  }
}