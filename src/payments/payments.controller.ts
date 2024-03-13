import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { PaymentsService } from './services/payments.service';
import { Coupon } from './entities/coupon.entity';
import { CouponService } from './services/coupon.service';
import { User } from 'src/auth/user.entity';
import { v4 as uuid } from 'uuid';
import { IssuedCoupon } from './entities/issued-coupon.entity';
import { getUser } from 'src/auth/get-user.decorator';
import { CreateCouponDto } from './dto/create-coupon.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentService: PaymentsService,
    private readonly couponService: CouponService,
  ) {}

  @Post('/order')
  async initOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.paymentService.initOrder(createOrderDto);
  }

  @Post('/order/:id')
  async completeOrder(@Param('id') id: string): Promise<Order> {
    return this.paymentService.completeOrder(id);
  }

  @Post('/coupon')
  async createCoupon(
    @Body() createCouponDto: CreateCouponDto,
  ): Promise<Coupon> {
    return this.couponService.createCoupon(createCouponDto);
  }

  @Post('/coupon/:couponId')
  async IssuedCoupon(
    @Param('couponId') couponId: uuid,
    @getUser() user: User,
  ): Promise<IssuedCoupon> {
    return this.couponService.issueCoupon(couponId, user);
  }
}
