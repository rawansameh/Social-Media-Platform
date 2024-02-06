import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
