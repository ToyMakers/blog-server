import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120, { message: 'Comment content must be 120 characters or less' })
  content: string;
}
