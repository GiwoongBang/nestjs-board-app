import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { Transactional } from 'typeorm-transactional';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { ProductService } from './product.service';
import { ShippingInfoRepository } from '../repositories/shipping-info.repository';
import { UserRepository } from 'src/auth/user.repository';
import { ShippingInfo } from '../entities/shipping-info.entity';
import { UUID } from 'crypto';
import { IssuedCouponRepository } from '../repositories/issued-coupon.repository';
import { PointRepository } from '../repositories/point.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly productService: ProductService,
    private readonly orderRepository: OrderRepository,
    private readonly issuedCouponRepository: IssuedCouponRepository,
    private readonly shippingInfoRepository: ShippingInfoRepository,
    private readonly userRepository: UserRepository,
    private readonly pointRepository: PointRepository,
  ) {}

  @Transactional()
  async initOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const totalAmount = await this.calculateTotalAmount(
      createOrderDto.orderItems,
    );

    const finalAmount = await this.applyDiscounts(
      totalAmount,
      createOrderDto.userId,
      createOrderDto.couponId,
      createOrderDto.pointAmountToUse,
    );

    return this.createOrder(
      createOrderDto.userId,
      createOrderDto.orderItems,
      finalAmount,
      createOrderDto.shippingAddress,
    );
  }

  private async createOrder(
    userId: string,
    orderItems: OrderItem[],
    finalAmount: number,
    shippingAddress?: string,
  ): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId) },
    });

    let shippingInfo: ShippingInfo;
    if (shippingInfo) {
      await this.shippingInfoRepository.createShippingInfo(shippingAddress);
    } else {
      await this.shippingInfoRepository.createShippingInfo(user.address);
    }

    return await this.orderRepository.createOrder(
      userId,
      orderItems,
      finalAmount,
      shippingInfo,
    );
  }

  @Transactional()
  async completeOrder(orderId: string): Promise<Order> {
    if (typeof orderId !== 'string' || orderId.trim() === '') {
      throw new BadRequestException('잘못된 주문번호입니다.');
    }
    return this.orderRepository.completeOrder(orderId);
  }

  private async calculateTotalAmount(orderItems: OrderItem[]): Promise<number> {
    let totalAmount = 0;

    const productIds = orderItems.map((item) => item.productId);
    const products = await this.productService.getProductsByIds(productIds);

    for (const item of orderItems) {
      const product = products.find((p) => p.id.toString() === item.productId);
      if (!product) {
        throw new BadRequestException(
          `다음 제품 정보를 확인할 수 없습니다. Product ID: ${item.productId}`,
        );
      }
      totalAmount += product.price * item.quantity;
    }

    return totalAmount;
  }

  private async applyDiscounts(
    totalAmount: number,
    userId: string,
    couponId?: UUID,
    pointAmountToUse?: number,
  ): Promise<number> {
    const couponDiscount = couponId
      ? await this.applyCoupon(couponId, userId, totalAmount)
      : 0;

    const pointDiscount = pointAmountToUse
      ? await this.applyPoints(pointAmountToUse, userId)
      : 0;

    const finalAmount = totalAmount - couponDiscount - pointDiscount;
    return finalAmount < 0 ? 0 : finalAmount;
  }

  private async applyCoupon(
    couponId: UUID,
    userId: string,
    totalAmount: number,
  ): Promise<number> {
    const issuedCoupon = await this.issuedCouponRepository.findOne({
      where: {
        coupon: { id: couponId },
        user: { id: parseInt(userId) },
      },
    });

    if (!issuedCoupon) {
      throw new BadRequestException(
        `쿠폰 정보가 유효하지 않습니다. couponId: ${couponId} userId: ${userId}`,
      );
    }

    const isValid =
      issuedCoupon?.isValid &&
      issuedCoupon?.validFrom <= new Date() &&
      issuedCoupon?.validUntil > new Date();
    if (!isValid) {
      throw new BadRequestException(
        `쿠폰 정보가 유효하지 않습니다. couponId: ${couponId} userId: ${userId}`,
      );
    }

    const { coupon } = issuedCoupon;
    if (coupon.type === 'percent') {
      return (totalAmount * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      return coupon.value;
    } else {
      return 0;
    }
  }

  private async applyPoints(
    pointAmountToUse: number,
    userId: string,
  ): Promise<number> {
    const point = await this.pointRepository.findOne({
      where: { user: { id: parseInt(userId) } },
    });
    if (point.availableAmount < 0 || point.availableAmount < pointAmountToUse) {
      throw new BadRequestException(
        `사용 가능한 포인트를 확인해 주세요. 나의 포인트: ${point.availableAmount}`,
      );
    }

    return pointAmountToUse;
  }
}
