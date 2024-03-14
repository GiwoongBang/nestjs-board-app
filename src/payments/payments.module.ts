import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './services/payments.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ShippingInfo } from './entities/shipping-info.entity';
import { Coupon } from './entities/coupon.entity';
import { IssuedCoupon } from './entities/issued-coupon.entity';
import { Product } from './entities/product.entity';
import { OrderRepository } from './repositories/order.repository';
import { ShippingInfoRepository } from './repositories/shipping-info.repository';
import { ProductRepository } from './repositories/product.repository';
import { IssuedCouponRepository } from './repositories/issued-coupon.repository';
import { UserRepository } from 'src/auth/user.repository';
import { CouponRepository } from './repositories/coupon.repository';
import { CouponService } from './services/coupon.service';
import { ProductService } from './services/product.service';
import { User } from 'src/auth/user.entity';
import { PointLog } from './entities/point-log.entity';
import { Point } from './entities/point.entity';
import { PointService } from './services/point.service';
import { PointRepository } from './repositories/point.repository';
import { PointLogRepository } from './repositories/point-log.repository';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      User,
      Coupon,
      IssuedCoupon,
      OrderItem,
      Order,
      PointLog,
      Point,
      Product,
      ShippingInfo,
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    CouponService,
    PaymentsService,
    PointService,
    ProductService,

    UserRepository,
    CouponRepository,
    IssuedCouponRepository,
    OrderRepository,
    PointLogRepository,
    PointRepository,
    ProductRepository,
    ShippingInfoRepository,
  ],
})
export class PaymentsModule {}
