import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john_doe',
    description: "The user's unique username",
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123!', description: "The user's password" })
  @IsNotEmpty()
  @IsString()
  password: string;
}
