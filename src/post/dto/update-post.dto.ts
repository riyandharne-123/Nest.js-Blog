/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto {
  @IsNotEmpty()
  post_id: number;
  
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}