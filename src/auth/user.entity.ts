/* eslint-disable prettier/prettier */
import { Comment } from '../comment/comment.entity';
import { Post } from '../post/post.entity';
import { BaseEntity, PrimaryGeneratedColumn, Entity, Column, Unique, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;

  @OneToMany(type => Post, post => post.user_id)
  @JoinColumn({ name: "user_id" })
  posts: Post[]

  @OneToMany(type => Comment, comment => comment.user_id)
  @JoinColumn({ name: "user_id" })
  comments: Comment[]
}