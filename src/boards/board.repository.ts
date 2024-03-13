import { EntityManager, Repository } from 'typeorm';
import { Board } from './board.entity';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BoardRepository extends Repository<Board> {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(
      boardRepository.target,
      boardRepository.manager,
      boardRepository.queryRunner,
    );
  }
}
