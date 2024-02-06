import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import mongoose from 'mongoose';

export class ViewProfileDto {
  username: String;

  email: String;

  fullName: String;

  bio: String;

  location: String;

  occupation: String;

  hobbies: [String];

  following: String[];

  posts: String[];
}
