/* eslint-disable prettier/prettier */
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/post/post.repository';
import { RedisService } from 'src/redis/redis.service';
import { CommentController } from './comment.controller';

import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository, PostRepository]),
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
    BullModule.registerQueue(
      {
        name: 'comment-notification',
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }
    )
  ],
  controllers: [CommentController],
  providers: [CommentService, RedisService]
})
export class CommentModule {}
