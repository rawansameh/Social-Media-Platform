import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from 'class-validator';
import mongoose from 'mongoose';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  @Length(3, 100)
  @Matches(/^[a-zA-Z]+ [a-zA-Z]+$/, {
    message: 'Full name must contain at least first and last name',
  })
  fullName: String;

  @IsOptional()
  @IsString()
  bio: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  occupation: String;

  @IsOptional()
  @IsString()
  hobbies: string[];
}
