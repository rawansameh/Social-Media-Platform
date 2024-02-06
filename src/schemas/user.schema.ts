import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from './posts.schema';

@Schema({})
export class User {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  fullName: String;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  bio: String;

  @Prop({ required: false })
  location: String;

  @Prop({ required: false })
  occupation: String;

  @Prop({ required: false })
  hobbies: [String];

  @Prop({ required: false })
  following: [{ type: mongoose.Schema.Types.ObjectId; ref: 'User' }];

  @Prop({ default: true })
  active: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts: Post[];
}
export const UserSchema = SchemaFactory.createForClass(User);
