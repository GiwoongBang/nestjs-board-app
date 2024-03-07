import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private readonly boardRepository: BoardRepository,
  ) {}

  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
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
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return foundBoard;
  }

  async deleteBoardById(id: number): Promise<void> {
    const foundBoard = await this.getBoardById(id);

    this.boardRepository.delete(foundBoard.id);
  }

  async updateBoardById(id: number, status: BoardStatus): Promise<Board> {
    const foundBoard = await this.getBoardById(id);

    foundBoard.status = status;
    await this.boardRepository.save(foundBoard);

    return foundBoard;
  }
}
