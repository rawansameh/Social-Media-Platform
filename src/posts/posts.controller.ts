import {
  Body,
  Controller,
  UseGuards,
  UsePipes,
  Post,
  ValidationPipe,
  Request,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  NotFoundException,
  UnauthorizedException,
  Delete,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/CreatePosts.Dto';
import { AuthGuard } from 'src/user/user.guard';
import { UpdatePostDto } from './dto/UpdatePosts.Dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { filtration } from './filtration.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { User } from 'src/schemas/user.schema';
import { Express } from 'express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';

import multer = require('multer');
import { join } from 'path/posix';
import { ImageSize } from './filtration.constants';
import { I18nLang, I18nService } from 'nestjs-i18n';

export const storage = {
  storage: diskStorage({
    destination: './uploads/posts-images',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private readonly i18n: I18nService,
  ) {}
  @Get()
  async getAllPosts(@Query() query: ExpressQuery, @I18nLang() lang: string) {
    return this.postsService.findAll(query, lang);
  }

  @Get('following')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getFollowingPost(
    @Request() req: any,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    try {
      const followingPosts = await this.postsService.getFollowingPost(
        req.user.id,
        filtration.Default,
        query,
        lang,
      );
      return { followingPosts };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate(
          'translation.NoPostsInYourFollowingFeed',
          {
            lang,
          },
        );
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Get('following/recent')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getFollowingPostRecent(
    @Request() req: any,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    try {
      const followingPosts = await this.postsService.getFollowingPost(
        req.user.id,
        filtration.Recent,
        query,
        lang,
      );
      return { followingPosts };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate(
          'translation.NoPostsInYourFollowingFeed',
          {
            lang,
          },
        );
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Get('following/oldest')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getFollowingPostOldest(
    @Request() req: any,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    try {
      const followingPosts = await this.postsService.getFollowingPost(
        req.user.id,
        filtration.Oldest,
        query,
        lang,
      );
      return { followingPosts };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate(
          'translation.NoPostsInYourFollowingFeed',
          {
            lang,
          },
        );
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Get('following/mostLiked')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async getFollowingPostMostLiked(
    @Request() req: any,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    try {
      const followingPosts = await this.postsService.getFollowingPost(
        req.user.id,
        filtration.MostLiked,
        query,
        lang,
      );
      return { followingPosts };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate(
          'translation.NoPostsInYourFollowingFeed',
          {
            lang,
          },
        );
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Get('wall')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async Wall(
    @Request() req: any,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    try {
      const wall = await this.postsService.Wall(
        filtration.Default,
        query,
        lang,
      );
      return { wall };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate(
          'translation.NoPostsInYourWallFeed',
          {
            lang,
          },
        );
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Get('wall/recent')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async WallRecent(
    @Request() req: any,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    try {
      const wall = await this.postsService.Wall(filtration.Recent, query, lang);
      return { wall };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate(
          'translation.NoPostsInYourWallFeed',
          {
            lang,
          },
        );
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Get('wall/oldest')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async WallOldest(
    @Request() req: any,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    try {
      const wall = await this.postsService.Wall(filtration.Oldest, query, lang);
      return { wall };
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate(
          'translation.NoPostsInYourWallFeed',
          {
            lang,
          },
        );
        throw new NotFoundException(message);
      }
      throw error;
    }
  }

  @Get('like/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async LikePost(
    @Param('id') id: string,
    @Request() req,
    @I18nLang() lang: string,
  ) {
    const likedPost = await this.postsService.LikePost(id, req.user.id, lang);
    return likedPost;
  }

  @Get('unlike/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async unLikePost(
    @Param('id') id: string,
    @Request() req,
    @I18nLang() lang: string,
  ) {
    const unlikedPost = await this.postsService.unLikePost(
      id,
      req.user.id,
      lang,
    );
    return unlikedPost;
  }

  @Get('/:id')
  async getPostbyID(@Param('id') id: string, @I18nLang() lang: string) {
    // try {
    const post = await this.postsService.getPostbyID(id, lang);
    return post;
    // } catch (error) {
    //   if (error instanceof NotFoundException) {
    //     const message = await this.i18n.translate('translation.PostNotFound', {
    //       lang,
    //     });
    //     throw new NotFoundException(message);
    //   }
    // }
  }

  @Get('viewLikes/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async viewLikes(
    @Param('id') id: string,
    @Request() req,
    @I18nLang() lang: string,
  ) {
    const viewLikes = await this.postsService.getLikesForPost(id, lang);
    return viewLikes;
  }

  @Get('wall/mostLiked')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async WallMostLiked(
    @Param('id') id: string,
    @Request() req,
    @Query() query: ExpressQuery,
    @I18nLang() lang: string,
  ) {
    const mostLiked = await this.postsService.Wall(
      filtration.MostLiked,
      query,
      lang,
    );
    return mostLiked;
  }

  @Post('/createPost')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', storage))
  async createPost(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Body('imageSize') imageSize: ImageSize,
    @I18nLang() lang: string,
  ) {
    try {
      const post = await this.postsService.createPost(
        req.user.id,
        createPostDto,
        file,
        req,
        imageSize,
        lang,
      );
      return post;
    } catch (error) {
      console.log(error);
      const message = await this.i18n.translate(
        'translation.FailedToCreatePost',
        {
          lang,
        },
      );
      throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
    @I18nLang() lang: string,
  ) {
    try {
      const updatedPost = await this.postsService.updatePost(
        postId,
        updatePostDto,
        req.user.id,
        lang,
      );
      return updatedPost;
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate('translation.PostNotFound', {
          lang,
        });
        throw new NotFoundException(message);
      } else if (error instanceof UnauthorizedException) {
        const message = await this.i18n.translate(
          'translation.YouAreNotTheOwnerOfThisPost',
          {
            lang,
          },
        );
        throw new UnauthorizedException(message);
      } else {
        throw error;
      }
    }
  }

  @Get('uploads/posts-images/:imagename')
  ViewImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/posts-images/' + imagename)),
    );
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async deletePost(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
    @I18nLang() lang: string,
  ) {
    try {
      const deletedPost = await this.postsService.DeletePost(
        postId,
        req.user.id,
        lang,
      );
      return deletedPost;
    } catch (error) {
      if (error instanceof NotFoundException) {
        const message = await this.i18n.translate('translation.PostNotFound', {
          lang,
        });
        throw new NotFoundException(message);
      } else if (error instanceof UnauthorizedException) {
        const message = await this.i18n.translate(
          'translation.YouAreNotTheOwnerOfThisPost',
          {
            lang,
          },
        );
        throw new UnauthorizedException(message);
      } else {
        throw error;
      }
    }
  }
}
