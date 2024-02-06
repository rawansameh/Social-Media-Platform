import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import mongoose from 'mongoose';
import { Post } from 'src/schemas/posts.schema';

export class ViewPostDto {
  user: string;

  title: string;

  contents: string;

  createdAt: Date;

  likes: number;

  image: string;
}
