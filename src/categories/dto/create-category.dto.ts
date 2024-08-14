import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'nestjs', description: 'The name of the category' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8, { message: 'Category name must be 8 characters or less' }) // 8글자 제한
  name: string;
}
