/* eslint-disable prettier/prettier */
import { InjectQueue } from '@nestjs/bull';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { PostRepository } from 'src/post/post.repository';
import { CommentRepository } from './comment.repository';
import { CreateCommentDto } from './dto/create-comments.dto';
import { UpdateCommentDto } from './dto/update-comments.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentRepository)
        private commentRepository: CommentRepository,

        @InjectRepository(PostRepository)
        private postRepository: PostRepository,

        @InjectQueue('comment-notification') private commentNotificationQueue: Queue
    ){}

    async getComments(data): Promise<any> {
        const post = await this.postRepository.findOne(data.query.post_id)

        if(!post) {
            throw new UnauthorizedException('Post does not exist.');
        }

        return await this.commentRepository.getComments(data.query)
    }

    async getComment(comment_id): Promise<any> {
        const comment = await this.commentRepository.findOne(comment_id)

        if(!comment) {
            throw new UnauthorizedException('Comment does not exist.');
        }

        return await this.commentRepository.getComment(comment_id)
    }

    async create(createCommentDto: CreateCommentDto): Promise<any> {
        const comment = await this.commentRepository.createComment(createCommentDto);
        
        await this.commentNotificationQueue.add({
            'comment': comment
        });
        
        return comment;
    }

    async update(updateCommentDto: UpdateCommentDto): Promise<any> {
        const comment = await this.commentRepository.findOne(updateCommentDto.comment_id);
    
        if(!comment) {
            throw new UnauthorizedException('Comment does not exist.');
        }

        return await this.commentRepository.updateComment(updateCommentDto);
    }

    async delete(comment_id): Promise<any> {
        const comment = await this.commentRepository.findOne(comment_id)

        if(!comment) {
            throw new UnauthorizedException('Comment does not exist.');
        }

        await this.commentRepository.remove(comment)

        return { 'message': 'Comment has been deleted.' };
    }
}
