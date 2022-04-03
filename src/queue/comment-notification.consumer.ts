/* eslint-disable prettier/prettier */
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('comment-notification')
export class CommentNotificationConsumer {
  @Process()
  async notify(job: Job<unknown>) {
    const data = JSON.parse(JSON.stringify(job.data));
    console.log('comment-notfication-' + data.comment.comment_id)
  }
}