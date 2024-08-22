import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the post',
  })
  id: string;

  @ApiProperty({ example: 'Post Title', description: 'The title of the post' })
  title: string;

  @ApiProperty({
    example: 'This is the content of the post',
    description: 'The content of the post',
  })
  content: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the author',
  })
  author: string;

  @ApiProperty({
    example: ['nestjs', 'mongodb'],
    description: 'Categories for the post',
  })
  categories: string[];

  @ApiProperty({
    example: '2024-07-18T12:34:56.000Z',
    description: 'The creation date of the post',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-07-18T12:34:56.000Z',
    description: 'The last update date of the post',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 42,
    description: 'The number of likes for the post',
  })
  likes: number;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the current user has liked the post',
  })
  isLikedByUser: boolean;
}
