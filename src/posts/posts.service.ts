import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CategoriesService } from '../categories/categories.service';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    authorId: Types.ObjectId,
  ): Promise<PostResponseDto> {
    const categoryIds = await this.validateCategories(createPostDto.categories);
    const post = new this.postModel({
      ...createPostDto,
      categories: categoryIds,
      author: authorId,
    });
    await post.save();

    const savedPost = await this.findOneWithLikeStatus(
      post._id.toString(),
      authorId,
    );
    return savedPost;
  }

  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    currentUserId: Types.ObjectId,
  ): Promise<PostResponseDto> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.author.equals(currentUserId)) {
      throw new ForbiddenException(
        'You do not have permission to edit this post',
      );
    }

    if (updatePostDto.categories) {
      post.categories = await this.validateCategories(updatePostDto.categories);
    }

    Object.assign(post, updatePostDto);
    await post.save();

    const updatedPost = await this.findOneWithLikeStatus(postId, currentUserId);
    return updatedPost;
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

  async findAllWithLikeStatus(
    userId: Types.ObjectId,
  ): Promise<PostResponseDto[]> {
    const posts = await this.postModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      {
        $unwind: '$authorDetails',
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          title: 1,
          content: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          likedBy: 1,
          author: '$authorDetails.username',
          categories: {
            $map: {
              input: '$categoryDetails',
              as: 'category',
              in: '$$category.name',
            },
          },
        },
      },
    ]);

    return posts.map((post) => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      categories: post.categories,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLikedByUser: post.likedBy.includes(userId),
    }));
  }

  async findOneWithLikeStatus(
    postId: string,
    userId: Types.ObjectId,
  ): Promise<PostResponseDto> {
    const posts = await this.postModel.aggregate([
      { $match: { _id: new Types.ObjectId(postId) } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categories',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      {
        $unwind: '$authorDetails',
      },
      {
        $project: {
          title: 1,
          content: 1,
          likes: 1,
          createdAt: 1,
          updatedAt: 1,
          likedBy: 1,
          author: '$authorDetails.username',
          categories: {
            $map: {
              input: '$categoryDetails',
              as: 'category',
              in: '$$category.name',
            },
          },
        },
      },
    ]);

    if (!posts || posts.length === 0) {
      throw new NotFoundException('Post not found');
    }

    const post = posts[0];

    return {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      categories: post.categories,
      likes: post.likes,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      isLikedByUser: post.likedBy.includes(userId),
    };
  }

  async likePost(
    postId: string,
    userId: Types.ObjectId,
  ): Promise<PostResponseDto> {
    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.likedBy.includes(userId)) {
      throw new BadRequestException('You have already liked this post');
    }

    post.likes += 1;
    post.likedBy.push(userId);

    await post.save();

    const likePost = await this.findOneWithLikeStatus(postId, userId);
    return likePost;
  }

  private async validateCategories(
    categoryNames: string[],
  ): Promise<Types.ObjectId[]> {
    if (!categoryNames || !categoryNames.length) {
      return [];
    }

    const validCategoryIds = await Promise.all(
      categoryNames.map(async (name): Promise<Types.ObjectId> => {
        let category = await this.categoriesService.findByName(name);
        if (!category) {
          category = await this.categoriesService.create({ name });
        }
        return category._id as Types.ObjectId;
      }),
    );

    return validCategoryIds;
  }
}
