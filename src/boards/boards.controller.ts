import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidatonPipe } from './pipes/board-status-validation.pipe';
import { BoardStatus } from './board-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get('/')
  async getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  @Post('/')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @getUser() user: User,
  ): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  async getBoardById(@Param('id', ParseIntPipe) id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteBoardById(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.boardsService.deleteBoardById(id);
  }

  @Patch('/status/:id')
  @UseGuards(AuthGuard())
  async updateBoardById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidatonPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoardById(id, status);
  }
}
