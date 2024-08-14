import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { Types } from 'mongoose';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: PostResponseDto,
  })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<PostResponseDto> {
    const authorId = new Types.ObjectId(req.user['userId']);
    const post = await this.postsService.createPost(createPostDto, authorId);
    return {
      title: post.title,
      content: post.content,
      author: post.author['username'],
      categories: post.categories.map((category) => category.toString()),
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLikedByUser: false,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Get all posts with like status for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'The posts have been successfully retrieved.',
    type: [PostResponseDto],
  })
  async findAll(@Req() req: Request): Promise<PostResponseDto[]> {
    const userId = new Types.ObjectId(req.user['userId']);
    return this.postsService.findAllWithLikeStatus(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a post with like status for the current user' })
  @ApiResponse({
    status: 200,
    description: 'The post with like status has been successfully retrieved.',
    type: PostResponseDto,
  })
  async findOne(
    @Param('id') postId: string,
    @Req() req: Request,
  ): Promise<PostResponseDto> {
    const userId = new Types.ObjectId(req.user['userId']);
    return this.postsService.findOneWithLikeStatus(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: PostResponseDto,
  })
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
  ): Promise<PostResponseDto> {
    const currentUserId = new Types.ObjectId(req.user['userId']);
    const post = await this.postsService.updatePost(
      postId,
      updatePostDto,
      currentUserId,
    );
    return {
      title: post.title,
      content: post.content,
      author: post.author['username'],
      categories: post.categories.map((category) => category.toString()),
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLikedByUser: post.likedBy.includes(currentUserId),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  async deletePost(
    @Param('id') postId: string,
    @Req() req: Request,
  ): Promise<void> {
    const currentUserId = new Types.ObjectId(req.user['userId']);
    return this.postsService.deletePost(postId, currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully liked.',
    type: PostResponseDto,
  })
  async likePost(
    @Param('id') postId: string,
    @Req() req: Request,
  ): Promise<PostResponseDto> {
    const userId = new Types.ObjectId(req.user['userId']);
    const post = await this.postsService.likePost(postId, userId);
    return {
      title: post.title,
      content: post.content,
      author: post.author['username'],
      categories: post.categories.map((category) => category.toString()),
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLikedByUser: true,
    };
  }
}
