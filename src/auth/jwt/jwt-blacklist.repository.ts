import { DataSource, Repository } from 'typeorm';
import { BlacklistToken } from './jwt-blacklist.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlacklistTokenRepository extends Repository<BlacklistToken> {
  constructor(dataSource: DataSource) {
    super(BlacklistToken, dataSource.createEntityManager());
  }
}
