/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  post_id: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  text: string;
}