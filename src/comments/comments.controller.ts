import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  @ApiOperation({ summary: 'Create a new comment on a post' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const authorId = new Types.ObjectId(req.user['userId']);
    const comment = await this.commentsService.create(
      createCommentDto,
      authorId,
      new Types.ObjectId(postId),
    );
    return {
      content: comment.content,
      author: comment.author,
      post: comment.post,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({ status: 200, description: 'Comments successfully retrieved.' })
  async findComments(@Param('postId') postId: string) {
    const comments = await this.commentsService.findByPost(
      new Types.ObjectId(postId),
    );
    return comments.map((comment) => ({
      content: comment.content,
      author: comment.author,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }));
  }
}
