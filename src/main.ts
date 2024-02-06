import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as express from 'express'; // Import express
import * as path from 'path'; // Import path
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 app.useGlobalPipes(new ValidationPipe());

  app.use('/uploads/posts-images', express.static(path.join(__dirname, 'uploads/posts-images')));
  await app.listen(3000);
}
dotenv.config();

bootstrap();
