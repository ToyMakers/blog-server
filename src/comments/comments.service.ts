import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: Types.ObjectId,
    postId: Types.ObjectId,
  ): Promise<CommentDocument> {
    const comment = new this.commentModel({
      ...createCommentDto,
      author: authorId,
      post: postId,
    });
    return comment.save();
  }

  async findByPost(postId: Types.ObjectId): Promise<CommentDocument[]> {
    return this.commentModel
      .find({ post: postId })
      .populate('author', 'username nickname')
      .exec();
  }
}
