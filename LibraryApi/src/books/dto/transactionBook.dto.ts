import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class transactionBookDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The book code' })
  bookCode: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Member code' })
  memberCode: string;
}
