/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './post.repository';
import { CommentRepository } from '../comment/comment.repository';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostRepository)
        private postRepository: PostRepository,

        @InjectRepository(CommentRepository)
        private commentRepository: CommentRepository,
    ){}

    async getPosts(data): Promise<any> {
        return await this.postRepository.getPosts(data.query)
    }

    async getPost(post_id): Promise<any> {
        const post = await this.postRepository.getPost(post_id)

        if(!post) {
            throw new UnauthorizedException('Post does not exist.');
        }

        return post;
    }

    async getUserPosts(data): Promise<any> {
        return await this.postRepository.getUserPosts(data.user_id, data.query);
    }

    async create(createPostDto: CreatePostDto): Promise<any> {
        return await this.postRepository.createPost(createPostDto);
    }

    async update(updatePostDto: UpdatePostDto): Promise<any> {
        const post = await this.postRepository.findOne({ post_id: updatePostDto.post_id });
    
        if(!post) {
            throw new UnauthorizedException('Post does not exist.');
        }

        return await this.postRepository.updatePost(updatePostDto);
    }

    async delete(post_id): Promise<any> {
        const post = await this.postRepository.getPost(post_id)

        if(!post) {
            throw new UnauthorizedException('Post does not exist.');
        }

        await this.commentRepository.remove(post.comments)
        await this.postRepository.remove(post)

        return { 'message': 'Post has been deleted.' };
    }
}
