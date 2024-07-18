import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'JohnDoe',
    description: "The user's new nickname",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  nickname?: string;

  @ApiProperty({
    example: 'Hello, I am John!',
    description: 'A short bio of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;
}
