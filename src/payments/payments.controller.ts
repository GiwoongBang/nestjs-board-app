import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
import { PointDto } from './dto/point.dto';
import { PointService } from './services/point.service';
import { Point } from './entities/point.entity';
import { PointLog } from './entities/point-log.entity';
import { PgConnectionService } from './services/pg.service';
import { PgConnectionDto } from './dto/pg-connection.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly couponService: CouponService,
    private readonly paymentService: PaymentsService,
    private readonly pointService: PointService,
    private readonly pgConnectionService: PgConnectionService,
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

  @Post('/point/earn')
  async earnPoint(
    @Body() pointDto: PointDto,
    @getUser() user: User,
  ): Promise<Point> {
    return this.pointService.earnPoint(pointDto, user);
  }

  @Post('/point/use')
  async usePoint(
    @Body() pointDto: PointDto,
    @getUser() user: User,
  ): Promise<Point> {
    return this.pointService.usePoint(pointDto, user);
  }

  @Get('/point/history')
  async pointHistory(@getUser() user: User): Promise<PointLog[]> {
    return this.pointService.getAllPointHistory(user);
  }

  @Post('/pg')
  async createPgConnection(
    @Body() pgConnectionDto: PgConnectionDto,
    @Body() order: Order,
    @getUser() user: User,
  ): Promise<string> {
    return this.pgConnectionService.createPgConnection(
      pgConnectionDto,
      order,
      user,
    );
  }
}
