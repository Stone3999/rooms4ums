import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './comment.schema';
import { PostsService } from './posts.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private postsService: PostsService,
  ) {}

  async create(createCommentDto: any): Promise<CommentDocument> {
    const createdComment = new this.commentModel(createCommentDto);
    const savedComment = await createdComment.save();
    
    // Incrementar el contador de comentarios en el Post
    await this.postsService.incrementCommentCount(createCommentDto.postId);
    
    return savedComment;
  }

  async findAllByPost(postId: string, page = 1, limit = 50): Promise<{ data: CommentDocument[], total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.commentModel.find({ postId: new Types.ObjectId(postId) }).sort({ createdAt: 1 }).skip(skip).limit(limit).exec(),
      this.commentModel.countDocuments({ postId: new Types.ObjectId(postId) }).exec(),
    ]);
    return { data, total };
  }

  async delete(id: string): Promise<any> {
    const result = await this.commentModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Comment not found');
    return { message: 'Comment deleted successfully' };
  }
}
