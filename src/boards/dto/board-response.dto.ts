import { BoardStatus } from '../board-status.enum';

export class BoardResponseDto {
  id: number;

  title: string;

  description: string;

  status: BoardStatus;

  user: {
    id: number;
  };
}
