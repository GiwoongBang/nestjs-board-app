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
import { BoardResponseDto } from './dto/board-response.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get('/')
  async getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  @Get('/my')
  @UseGuards(AuthGuard())
  async getAllMyBoards(@getUser() user: User): Promise<Board[]> {
    return this.boardsService.getAllMyBoards(user);
  }

  @Post('/')
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  async createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @getUser() user: User,
  ): Promise<BoardResponseDto> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  async getBoardById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BoardResponseDto> {
    return this.boardsService.getBoardById(id);
  }

  @Patch('/status/:id')
  @UseGuards(AuthGuard())
  async updateBoardById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', BoardStatusValidatonPipe) status: BoardStatus,
  ): Promise<BoardResponseDto> {
    return this.boardsService.updateBoardById(id, status);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteMyBoardById(
    @Param('id', ParseIntPipe) id: number,
    @getUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteMyBoardById(id, user);
  }
}
