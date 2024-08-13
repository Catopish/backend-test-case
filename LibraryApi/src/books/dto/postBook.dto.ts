import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class postBookDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The book code' })
  code: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the Book' })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Author of the Book' })
  author: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Stock of the Book' })
  stock: number;
}
