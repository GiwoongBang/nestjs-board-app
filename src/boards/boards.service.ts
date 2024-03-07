import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';
import { getUser } from 'src/auth/get-user.decorator';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }

  async getAllMyBoards(@getUser() user: User): Promise<Board[]> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title: title,
      description: description,
      status: BoardStatus.PUBLIC,
      user: user,
    });

    await this.boardRepository.save(board);

    return board;
  }

  async getBoardById(id: number): Promise<Board> {
    const foundBoard = await this.boardRepository.findOne({ where: { id } });

    if (!foundBoard) {
      throw new NotFoundException(`해당 게시물을 찾을 수 없습니다. ${id}`);
    }

    return foundBoard;
  }

  async updateBoardById(id: number, status: BoardStatus): Promise<Board> {
    const foundBoard = await this.getBoardById(id);

    foundBoard.status = status;
    await this.boardRepository.save(foundBoard);

    return foundBoard;
  }

  async deleteMyBoardById(id: number, user: User): Promise<void> {
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('id = :id AND userId = :userId', { id, userId: user.id });

    const result = await query.delete().execute();

    if (result.affected === 0) {
      throw new NotFoundException(`해당 게시물을 찾을 수 없습니다. ${id}`);
    }
  }
}
