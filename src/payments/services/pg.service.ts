import { Injectable } from '@nestjs/common';
import { PgConnectionRepository } from '../repositories/pg.repository';
import { PgConnection } from '../entities/pg.entity';
import { User } from 'src/auth/user.entity';
import { PgConnectionDto } from '../dto/pg-connection.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class PgConnectionService {
  constructor(
    private readonly pgConnectionRepository: PgConnectionRepository,
  ) {}

  createPgConnection(
    pgConnectionDto: PgConnectionDto,
    order: Order,
    user: User,
  ): Promise<string> {
    const { impUid, amount } = pgConnectionDto;

    const pgInfo = new PgConnection();
    pgInfo.impUid = impUid;
    pgInfo.amount = amount;
    pgInfo.status = 'payment';
    pgInfo.user = user;
    pgInfo.order = order;

    return this.pgConnectionRepository.savePgInfo(pgInfo);
  }
}
