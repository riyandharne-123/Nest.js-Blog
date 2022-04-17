/* eslint-disable prettier/prettier */
import { User } from '../auth/user.entity';
import { Comment } from '../comment/comment.entity';
import { BaseEntity, PrimaryGeneratedColumn, Entity, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  user_id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

  @ManyToOne(type => User, user => user.user_id)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(type => Comment, comment => comment.post)
  @JoinColumn({ name: "post_id" })
  comments: Comment[];
}