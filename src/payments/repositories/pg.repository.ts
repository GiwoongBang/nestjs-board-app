import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PgConnection } from '../entities/pg.entity';

@Injectable()
export class PgConnectionRepository extends Repository<PgConnection> {
  constructor(
    @InjectRepository(PgConnection)
    private readonly pgConnectionRepository: PgConnectionRepository,
  ) {
    super(
      pgConnectionRepository.target,
      pgConnectionRepository.manager,
      pgConnectionRepository.queryRunner,
    );
  }

  async savePgInfo(pgInfo: PgConnection): Promise<string> {
    const savedPgInfo = await this.pgConnectionRepository.save(pgInfo);

    if (!savedPgInfo) {
      throw new InternalServerErrorException(
        '결제 정보가 정상 처리되지 않았습니다. 고객센터로 문의해 주세요',
      );
    } else {
      return '결제가 정상적으로 처리되었습니다.';
    }
  }
}
