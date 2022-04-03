/* eslint-disable prettier/prettier */
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentRepository } from 'src/comment/comment.repository';
import { RedisService } from 'src/redis/redis.service';

import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, CommentRepository]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'jwt-secret',
      signOptions: {
        expiresIn: 3600,
      }
    }),
    CacheModule.registerAsync({
      useFactory: async() => ({
        store: redisStore,
        host: 'localhost',
        port: 6379
      })
    }),
  ],
  controllers: [PostController],
  providers: [PostService, RedisService]
})
export class PostModule {}
