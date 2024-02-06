import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { User } from 'src/schemas/user.schema';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  contents: string;

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsOptional()
  image: string;
}