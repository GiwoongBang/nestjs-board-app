import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsService } from './payments/services/payments.service';
import { OrderRepository } from './payments/repositories/order.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeORMConfig),
    BoardsModule,
    AuthModule,
    PaymentsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, OrderRepository],
})
export class AppModule {}
