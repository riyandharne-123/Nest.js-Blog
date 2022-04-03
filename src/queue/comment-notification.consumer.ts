/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { CommentRepository } from 'src/comment/comment.repository';
import { PostRepository } from 'src/post/post.repository';

@Processor('comment-notification')
export class CommentNotificationConsumer {
  constructor(
    private readonly mailerService: MailerService,

    @InjectRepository(PostRepository)
    private postRepository: PostRepository,

    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
    ) {}

  @Process()
  async notify(job: Job<unknown>) {
    const data = JSON.parse(JSON.stringify(job.data));

    const post = await this.postRepository.getPost(data.comment.post_id)
    const comment = await this.commentRepository.getComment(data.comment.comment_id)

    console.log('processing:job:comment-notfication-' + data.comment.comment_id)

    this.mailerService
    .sendMail({
      to: post.user.email,
      from: 'noreply@nestjs.com',
      subject: `${comment.user.name} commented on your post ✔`,
      text: `@${comment.user.name} commented: ${comment.text} on your post: ${post.title}`,
      //html: '<b>welcome</b>'
    })
    .then(() => {
      console.log('successfull:job:comment-notfication-' + data.comment.comment_id)
      job.moveToCompleted('successfull:job:comment-notfication-' + data.comment.comment_id, true)
    })
    .catch(() => {
      console.log('failed:job:comment-notfication-' + data.comment.comment_id)
      job.moveToFailed({message: 'failed:job:comment-notfication-' + data.comment.comment_id}, true)
    });
  }
}