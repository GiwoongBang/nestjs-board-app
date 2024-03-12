import { BadRequestException, PipeTransform } from '@nestjs/common';
import { BoardStatus } from '../board-status.enum';

export class BoardStatusValidatonPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PRIVATE, BoardStatus.PUBLIC];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(
        `적절한 게시글의 상태 옵션이 아닙니다. your option: ${value}`,
      );
    }

    return value;
  }

  private isStatusValid(status: any): boolean {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
