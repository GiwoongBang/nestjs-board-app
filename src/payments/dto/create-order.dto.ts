import { UUID } from 'crypto';
import { OrderItem } from '../entities/order-item.entity';

export type CreateOrderDto = {
  userId: string;
  orderItems: OrderItem[];
  couponId?: UUID;
  pointAmountToUse?: number;
  shippingAddress?: string;
};
