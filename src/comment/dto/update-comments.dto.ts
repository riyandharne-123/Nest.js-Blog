/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto {
  @IsNotEmpty()
  comment_id: number;

  @IsNotEmpty()
  text: string;
}