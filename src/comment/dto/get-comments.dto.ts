/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class GetCommentsDto {
  @IsNotEmpty()
  post_id: number;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  per_page: number;

  @IsNotEmpty()
  order_by_col: string;

  @IsNotEmpty()
  order_by_dir: string;
}