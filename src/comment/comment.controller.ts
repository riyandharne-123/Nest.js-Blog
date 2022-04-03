/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RedisService } from 'src/redis/redis.service';

import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comments.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { UpdateCommentDto } from './dto/update-comments.dto';

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
    constructor(private commentService: CommentService, private redisService: RedisService) {}

    @Get('/post')
    async getPostComments(@Request() req, @Request() getCommentsDto: GetCommentsDto): Promise<any> {
        const cachedComments = await this.redisService.getQuery('comments_' + req.query.post_id, getCommentsDto)

        if(cachedComments) {
            return cachedComments
        }

        const comments = await this.commentService.getComments(getCommentsDto);
        await this.redisService.setQuery('comments_' + req.query.post_id, getCommentsDto, comments);
    
        return comments
    }

    @Get('/details')
    async getComment(@Body() req): Promise<any> {
        const cachedComment = await this.redisService.getObject('comment_' + req.comment_id);

        if(cachedComment) {
            return cachedComment;
        }

        const comment = await this.commentService.getComment(req.comment_id);
        await this.redisService.setObject('comment_' + req.comment_id, comment)

        return comment
    }

    @Post('/create')
    async createComment(@Body() createCommentDto: CreateCommentDto): Promise<any> {
        const comment = await this.commentService.create(createCommentDto)
        await this.redisService.setObject('comment_' + comment.comment_id, comment)
        return comment;
    }

    @Post('/update')
    async updateComment(@Body() updateCommentDto: UpdateCommentDto): Promise<any> {
        const comment = await this.commentService.update(updateCommentDto)
        await this.redisService.setObject('comment_' + comment.comment_id, comment)
        return comment;
    }

    @Post('/delete')
    async deleteComment(@Body() body, @Request() req): Promise<any> {
        await this.redisService.deleteObject('comment_' + body.comment_id)
        await this.redisService.deleteQuery('comments_' + req.user.user_id)
        return await this.commentService.delete(body.comment_id)
    }
}
