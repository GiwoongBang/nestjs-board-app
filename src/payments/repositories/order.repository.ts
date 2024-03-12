import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { ShippingInfo } from '../entities/shipping-info.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { IssuedCouponRepository } from './issued-coupon.repository';

@Injectable()
export class OrderRepository extends Repository<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly userRepository: UserRepository,
    private readonly issuedCouponRepository: IssuedCouponRepository,
  ) {
    super(
      orderRepository.target,
      orderRepository.manager,
      orderRepository.queryRunner,
    );
  }

  async createOrder(
    userId: string,
    orderItems: OrderItem[],
    finalAmount: number,
    shippingInfo?: ShippingInfo,
  ): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) },
    });

    const order = new Order();
    order.user = user;
    order.amount = finalAmount;
    order.status = 'started';
    order.items = orderItems;
    order.shippingInfo = shippingInfo;

    return this.orderRepository.save(order);
  }

  async completeOrder(orderId: string): Promise<Order> {
    const order = await this.findOne({ where: { id: parseInt(orderId) } });
    order.status = 'paid';

    await this.issuedCouponRepository.use(order.usedIssuedCoupon);
    return this.orderRepository.save(order);
  }
}
