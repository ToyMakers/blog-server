import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async createPost(
    createPostDto: CreatePostDto,
    authorId: Types.ObjectId,
  ): Promise<PostDocument> {
    const post = new this.postModel({
      ...createPostDto,
      author: authorId,
    });
    return post.save();
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    currentUserId: Types.ObjectId,
  ): Promise<PostDocument> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.author.equals(currentUserId)) {
      throw new ForbiddenException(
        'You do not have permission to edit this post',
      );
    }

    Object.assign(post, updatePostDto);
    return post.save();
  }

  async deletePost(
    postId: string,
    currentUserId: Types.ObjectId,
  ): Promise<void> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.author.equals(currentUserId)) {
      throw new ForbiddenException(
        'You do not have permission to delete this post',
      );
    }

    await this.postModel.findByIdAndDelete(postId);
  }

  async findOne(postId: string): Promise<PostDocument> {
    const post = await this.postModel
      .findById(postId)
      .populate('author', 'username nickname')
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findAll(categories?: string[]): Promise<PostDocument[]> {
    const query = categories
      ? {
          categories: {
            $elemMatch: { $regex: categories.join('|'), $options: 'i' },
          },
        }
      : {};
    return this.postModel
      .find(query)
      .populate('author', 'username nickname')
      .exec();
  }
}
