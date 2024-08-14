import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
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
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts or filter by categories' })
  @ApiQuery({
    name: 'categories',
    required: false,
    description: 'Comma separated list of categories to filter posts',
  })
  @ApiResponse({
    status: 200,
    description: 'The posts have been successfully retrieved.',
    type: [PostResponseDto],
  })
  async findAll(
    @Query('categories') categories?: string,
  ): Promise<PostResponseDto[]> {
    const categoryArray = categories ? categories.split(',') : undefined;
    const posts = await this.postsService.findAll(categoryArray);
    return posts.map((post) => ({
      title: post.title,
      content: post.content,
      author: post.author['username'],
      categories: post.categories.map((category) => category.toString()),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You do not have permission to edit this post.',
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
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. You do not have permission to delete this post.',
  })
  async deletePost(
    @Param('id') postId: string,
    @Req() req: Request,
  ): Promise<void> {
    const currentUserId = new Types.ObjectId(req.user['userId']);
    return this.postsService.deletePost(postId, currentUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single post by ID' })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully retrieved.',
    type: PostResponseDto,
  })
  async findOne(@Param('id') postId: string): Promise<PostResponseDto> {
    const post = await this.postsService.findOne(postId);
    return {
      title: post.title,
      content: post.content,
      author: post.author['username'],
      categories: post.categories.map((category) => category.toString()),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
