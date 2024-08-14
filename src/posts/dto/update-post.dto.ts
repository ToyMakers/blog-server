import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    example: 'Updated Post Title',
    description: 'The title of the post',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'This is the updated content of the post',
    description: 'The content of the post',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: ['nestjs', 'mongodb'],
    description: 'Categories for the post',
    required: false,
  })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
