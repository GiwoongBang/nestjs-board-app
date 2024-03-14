import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { PointLog } from '../entities/point-log.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Point } from '../entities/point.entity';

@Injectable()
export class PointLogRepository extends Repository<PointLog> {
  constructor(
    @InjectRepository(PointLog)
    private readonly pointLogRepository: Repository<PointLog>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      pointLogRepository.target,
      pointLogRepository.manager,
      pointLogRepository.queryRunner,
    );
  }

  earn(point: Point, amountToEarn: number, reason: string): Promise<PointLog> {
    const pointLog = new PointLog();
    pointLog.point = point;
    pointLog.earn(amountToEarn, reason);
    return this.pointLogRepository.save(pointLog);
  }

  use(point: Point, amountToUse: number, reason: string): Promise<PointLog> {
    const pointLog = new PointLog();
    pointLog.point = point;
    pointLog.use(amountToUse, reason);
    return this.pointLogRepository.save(pointLog);
  }
}
