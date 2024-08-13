import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class postMemberDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The member code' })
  code: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the member' })
  name: string;
}
