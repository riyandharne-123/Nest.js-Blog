/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RedisService } from 'src/redis/redis.service';
import { CreatePostDto } from './dto/create-post.dto';
import { GetPostsDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostController {
    constructor(private postService: PostService, private redisService: RedisService) {}

    @Get('/all')
    async getPosts(@Request() getPostsDto: GetPostsDto): Promise<any> {

        const cachedPosts = await this.redisService.getQuery('posts', getPostsDto)

        if(cachedPosts) {
            return cachedPosts
        }

        const posts = await this.postService.getPosts(getPostsDto);
        await this.redisService.setQuery('posts', getPostsDto, posts)

        return posts
    }

    @Get('/details')
    async post(@Body() req): Promise<any> {
        const cachedPost = await this.redisService.getObject('post_' + req.post_id)

        if(cachedPost) {
            return cachedPost
        }

        const post = await this.postService.getPost(req.post_id);
        await this.redisService.setObject('post_' + req.post_id, post)

        return post
    }

    @Get('/user')
    async userPosts(@Request() getPostsDto: GetPostsDto): Promise<any> {
        getPostsDto['user_id'] = getPostsDto['user']?.user_id;

        const cachedPosts = await this.redisService.getQuery('posts_' + getPostsDto['user_id'], getPostsDto)

        if(cachedPosts) {
            return cachedPosts
        }

        const posts = await this.postService.getUserPosts(getPostsDto);
        await this.redisService.setQuery('posts_' + getPostsDto['user_id'], getPostsDto, posts)

        return posts
    }

    @Post('/create')
    async create(@Request() req, @Body() createPostDto: CreatePostDto): Promise<any> {
        const post = createPostDto;
        post['user_id'] = req?.user?.user_id;

        const newPost = await this.postService.create(post);
        await this.redisService.setObject('post_' + newPost.post_id, newPost)

        return newPost
    }

    @Post('/update')
    async update(@Body() updatePostDto: UpdatePostDto): Promise<any> {
        const post = await this.postService.update(updatePostDto);
        await this.redisService.setObject('post_' + post.post_id, post)
        return post;
    }

    @Post('/delete')
    async delete(@Body() body, @Request() req): Promise<any> {
        const user_id = req.user.user_id;
        await this.redisService.deleteQuery('posts_' + user_id)
        await this.redisService.deleteObject('post_' + body.post_id)
        await this.redisService.deleteQuery('comments_' + user_id)
        return await this.postService.delete(body.post_id);
    }
}
