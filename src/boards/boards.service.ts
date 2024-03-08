import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';
import { getUser } from 'src/auth/get-user.decorator';
import { BoardResponseDto } from './dto/board-response.dto';

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
    query.select([
      'board.id',
      'board.title',
      'board.description',
      'board.status',
      'user.id',
    ]);
    query.innerJoin('board.user', 'user');
    query.where('user.id = :userId', { userId: user.id });

    const boards = await query.getMany();

    return boards;
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<BoardResponseDto> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title: title,
      description: description,
      status: BoardStatus.PUBLIC,
      user: user,
    });

    await this.boardRepository.save(board);

    const response = new BoardResponseDto();
    response.id = board.id;
    response.title = board.title;
    response.description = board.description;
    response.status = board.status;
    response.user = { id: board.user.id };

    return response;
  }

  async getBoardById(id: number): Promise<BoardResponseDto> {
    const foundBoard = await this.boardRepository.findOne({ where: { id } });

    if (!foundBoard) {
      throw new NotFoundException(`해당 게시물을 찾을 수 없습니다. ${id}`);
    }

    const response = new BoardResponseDto();
    response.id = foundBoard.id;
    response.title = foundBoard.title;
    response.description = foundBoard.description;
    response.status = foundBoard.status;
    response.user = { id: foundBoard.user.id };

    return response;
  }

  async updateBoardById(
    id: number,
    status: BoardStatus,
  ): Promise<BoardResponseDto> {
    const foundBoard = await this.boardRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!foundBoard) {
      throw new NotFoundException(`해당 게시물을 찾을 수 없습니다. ${id}`);
    }

    foundBoard.status = status;
    await this.boardRepository.save(foundBoard);

    const response = new BoardResponseDto();
    response.id = foundBoard.id;
    response.title = foundBoard.title;
    response.description = foundBoard.description;
    response.status = foundBoard.status;
    response.user = { id: foundBoard.user.id };

    return response;
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
