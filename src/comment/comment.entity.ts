/* eslint-disable prettier/prettier */
import { User } from '../auth/user.entity';
import { Post } from '../post/post.entity';
import { BaseEntity, PrimaryGeneratedColumn, Entity, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column()
  text: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

  @ManyToOne(type => User, user => user.user_id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(type => Post, post => post.post_id)
  @JoinColumn({ name: "post_id" })
  post: Post;
}