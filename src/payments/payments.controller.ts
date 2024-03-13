import { Controller, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { PaymentsService } from './services/payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('/')
  async initOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.paymentService.initOrder(createOrderDto);
  }

  @Post('/:id')
  async completeOrder(@Param('id') id: string): Promise<Order> {
    return this.paymentService.completeOrder(id);
  }
}
