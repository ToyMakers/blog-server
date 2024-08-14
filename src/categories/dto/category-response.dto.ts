import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({
    example: '64bdfc08e13b3c19e6e5dcd3',
    description: 'The ID of the category',
  })
  _id: string;

  @ApiProperty({ example: 'nestjs', description: 'The name of the category' })
  name: string;
}
