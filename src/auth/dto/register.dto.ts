// src/auth/dto/register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'john_doe',
    description: "The user's unique username",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  username: string;

  @ApiProperty({ example: 'password123!', description: "The user's password" })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
    {
      message: 'Password too weak',
    },
  )
  password: string;

  @ApiProperty({ example: 'JohnDoe', description: "The user's nickname" })
  @IsNotEmpty()
  @IsString()
  @MaxLength(8)
  nickname: string;

  @ApiProperty({
    example: 'Hello, I am John!',
    description: 'A short bio of the user',
  })
  @IsString()
  bio: string;
}
