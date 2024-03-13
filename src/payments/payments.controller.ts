import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { PaymentsService } from './services/payments.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { CouponService } from './services/coupon.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { UUID } from 'crypto';
import { IssuedCoupon } from './entities/issued-coupon.entity';
import { getUser } from 'src/auth/get-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentsService,
    private readonly couponService: CouponService,
  ) {}

  @Post('/order')
  async initOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.paymentService.initOrder(createOrderDto);
  }

  @Post('/order/:id')
  async completeOrder(@Param('id') id: string): Promise<Order> {
    return this.paymentService.completeOrder(id);
  }

  @Post('/coupon')
  @UseGuards(AuthGuard())
  async createCoupon(createCouponDto: CreateCouponDto): Promise<Coupon> {
    return this.couponService.createCoupon(createCouponDto);
  }

  @Post('/coupon/:couponId')
  @UseGuards(AuthGuard())
  async IssuedCoupon(
    @Param('couponId') couponId: UUID,
    @getUser() user: User,
  ): Promise<IssuedCoupon> {
    return this.couponService.issueCoupon(couponId, user);
  }
}
