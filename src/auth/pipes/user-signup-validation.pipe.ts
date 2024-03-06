import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);
    const errors = await validate(object);

    const errormessage = '입력한 값이 올바르지 않습니다. 다시 확인해주세요.';
    if (errors.length > 0) {
      throw new BadRequestException(errormessage);
    }

    return value;
  }
}
