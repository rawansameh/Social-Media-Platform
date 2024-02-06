import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { PostsModule } from './posts/posts.module';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schema';
import { Post, PostSchema } from './schemas/posts.schema';
import { ConfigModule } from '@nestjs/config';
//import { AppService } from './app.service';
import {
  I18nModule,
  HeaderResolver,
  AcceptLanguageResolver,
} from 'nestjs-i18n';
import * as path from 'path';
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [{ use: AcceptLanguageResolver, options: ['en', 'ar'] }],
    }),
    UserModule,
    // MongooseModule.forRoot('mongodb://127.0.0.1/nest'),
    MongooseModule.forRoot('mongodb://mongodb:27017/nest'),
    PostsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
