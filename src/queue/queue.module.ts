/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { CommentNotificationConsumer } from './comment-notification.consumer';
import { MailerModule } from '@nestjs-modules/mailer';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from 'src/post/post.repository';
import { CommentRepository } from 'src/comment/comment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostRepository, CommentRepository]),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: "",
          pass: ""
        }
      },
      defaults: {
        from: '"nest-blog" <modules@nestjs.com>',
      },
    })
  ],
  providers: [CommentNotificationConsumer]
})

export class QueueModule {}
