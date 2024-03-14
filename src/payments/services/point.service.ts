import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { Point } from '../entities/point.entity';
import { PointRepository } from '../repositories/point.repository';
import { PointLogRepository } from '../repositories/point-log.repository';
import { User } from 'src/auth/user.entity';
import { PointDto } from '../dto/point.dto';
import { PointLog } from '../entities/point-log.entity';

@Injectable()
export class PointService {
  constructor(
    private readonly pointRepository: PointRepository,
    private readonly pointLogRepository: PointLogRepository,
  ) {}

  @Transactional()
  async earnPoint(pointDto: PointDto, user: User): Promise<Point> {
    const { amount, reason } = pointDto;

    const point = await this.pointRepository.findOne({ where: { user: user } });

    if (!point) {
      throw new BadRequestException(
        `해당 유저의 포인트 정보를 확인할 수 없습니다. userId: ${user.id}`,
      );
    }
    point.earn(amount);

    await this.pointLogRepository.earn(point, amount, reason);
    return this.pointRepository.save(point);
  }

  @Transactional()
  async usePoint(pointDto: PointDto, user: User): Promise<Point> {
    const { amount, reason } = pointDto;

    const point = await this.pointRepository.findOne({ where: { user: user } });

    if (!point) {
      throw new BadRequestException(
        `해당 유저의 포인트 정보를 확인할 수 없습니다. userId: ${user.id}`,
      );
    }
    point.use(amount);

    await this.pointLogRepository.use(point, amount, reason);
    return this.pointRepository.save(point);
  }

  async getAllPointHistory(user: User): Promise<PointLog[]> {
    const point = await this.pointRepository.findOne({ where: { user: user } });

    if (!point) {
      throw new BadRequestException(
        `해당 유저의 포인트 정보를 확인할 수 없습니다. userId: ${user.id}`,
      );
    }

    const history = await this.pointLogRepository.find({
      where: { point: point },
    });

    return history;
  }
}
