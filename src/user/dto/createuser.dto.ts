import { BadRequestException } from '@nestjs/common';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  MinLength,
  Length,
  Matches,
  IsUrl,
} from 'class-validator';
import mongoose from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { ValidationError, validate } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'translation.email' })
  email: string;

  @IsNotEmpty({ message: 'Username required' })
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  @Matches(/^[a-zA-Z]+ [a-zA-Z]+$/, {
    message: 'fullName',
  })
  fullName: String;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

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

  // @IsOptional()
  // following: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId;
  //     ref: 'User';
  //   },
  // ];
}
