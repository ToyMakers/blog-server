import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Post Title', description: 'The title of the post' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'This is the content of the post',
    description: 'The content of the post',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: ['nestjs', 'mongodb'],
    description: 'Categories for the post',
  })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
