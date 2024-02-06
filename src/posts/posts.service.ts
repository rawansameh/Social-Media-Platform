import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from 'src/schemas/posts.schema';
import { User } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { CreatePostDto } from './dto/CreatePosts.Dto';
import { UpdatePostDto } from './dto/UpdatePosts.Dto';
import { ViewPostDto } from './dto/ViewPost.Dto';
import { Query } from 'express-serve-static-core';
import { filtration } from './filtration.constants';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import path from 'path';
import { ImageSize } from './filtration.constants';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly i18n: I18nService,
    private readonly configService: ConfigService, // Add ConfigService for retrieving public folder path
  ) {}

  async findAll(query: Query, lang: string): Promise<Post[]> {
    const postPerPage = Number(query.count);
    const currentPage = Number(query.page) || 1;
    const skip = postPerPage * (currentPage - 1);

    const posts = await this.postModel.find().limit(postPerPage).skip(skip);

    if (!posts) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }
    return posts;
  }

  async getPostbyID(id: string, lang: string) {
    const post = await this.postModel.findById({ _id: id });
    if (!post) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    const postView = new ViewPostDto();

    const user = await this.userModel.findById(post.user);

    if (user) {
      postView.user = `${user.fullName} (${user.username})`;
    } else {
      postView.user = this.i18n.translate('translation.userNotFound', { lang });
    }

    postView.title = post.title;
    postView.contents = post.contents;
    postView.image = post.image;
    postView.likes = post.likes.length;
    postView.createdAt = post.createdAt;

    return postView;
  }

  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
    req: Request, // Add this parameter,
    imageSize: ImageSize, // Include the imageSize parameter
    lang: string,
  ): Promise<Post> {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) {
      const message = await this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new HttpException(message, 404);
    }
    console.log(file);
    const resizedImage = await this.processAndSaveImage(file, imageSize, lang);

    //const imagePath = ( "/posts/"+file.path);
    const newPost = await new this.postModel({
      ...createPostDto,
      user: userId,
      image: resizedImage,
    });
    await newPost.save();
    await findUser.updateOne({
      $push: {
        posts: newPost._id,
      },
    });
    return newPost;
  }

  private async processAndSaveImage(
    file: Express.Multer.File,
    imageSize: ImageSize,
    lang: string,
  ): Promise<string> {
    let resizeOptions;
    switch (imageSize) {
      case ImageSize.Thumbnail:
        resizeOptions = { width: 100, height: 100 };
        break;
      case ImageSize.Featured:
        resizeOptions = { width: 200, height: 200 };
        break;
      case ImageSize.Item:
        resizeOptions = { width: 500, height: 500 };
        break;
      default:
        const errorMessage = await this.i18n.translate(
          'translation.UnsupportedImageSize',
          { lang },
        );

        throw new Error(`${errorMessage}: ${imageSize}`);
    }

    const newFilename = 'resized_' + file.filename;
    // Since we're focusing on eliminating .join(), let's ensure we're not using it even indirectly.
    // If outputPath construction was somehow related to the error indirectly through path manipulation,
    // we directly concatenate strings here, ensuring the path is correctly formed.
    const outputPath = file.destination + '/' + newFilename;

    try {
      await sharp(file.path).resize(resizeOptions).toFile(outputPath);
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = await this.i18n.translate(
        'translation.FailedToProcessImage',
        { lang },
      );
      throw new Error('Failed to process image');
    }

    // Return the path of the resized image
    // Adjust this path as necessary, especially if serving static files
    return outputPath;
  }

  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
    lang: string,
  ): Promise<Post> {
    const existingPost = await this.postModel.findById(id);

    if (!existingPost) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    if (existingPost.user.toString() !== userId) {
      const message = await this.i18n.translate(
        'translation.YouAreNotTheOwnerOfThisPost',
        {
          lang,
        },
      );
      throw new UnauthorizedException(message);
    }

    existingPost.title = updatePostDto.title;
    existingPost.contents = updatePostDto.contents;
    existingPost.createdAt = new Date(Date.now());
    existingPost.image = updatePostDto.image;
    const updatedPost = await existingPost.save();

    return updatedPost;
  }

  async DeletePost(id: string, userId: string, lang: string) {
    const existingPost = await this.postModel.findById(id);

    if (!existingPost) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    if (existingPost.user.toString() !== userId) {
      const message = await this.i18n.translate(
        'translation.YouAreNotTheOwnerOfThisPost',
        {
          lang,
        },
      );
      throw new UnauthorizedException(message);
    }
    await this.userModel.findByIdAndUpdate(userId, { $pull: { posts: id } });

    return this.postModel.findByIdAndDelete(id);
  }

  async getFollowingPost(
    userId: string,
    filter: filtration,
    query: Query,
    lang: string,
  ) {
    const user = await this.userModel.findById({ _id: userId, active: true });
    if (!user) {
      const message = await this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    const postPerPage = Number(query.count) || 3;
    const currentPage = Number(query.page) || 1;
    const skip = postPerPage * (currentPage - 1);
    const followingUserIds = user.following
      .filter((followingUser) => followingUser?.type?.path)
      .map((followingUser) => followingUser.type.path.toString());

    const followingUsers = await this.userModel.find({
      _id: { $in: followingUserIds },
    });

    if (filter == filtration.Recent) {
      var posts = await this.postModel
        .find({
          user: { $in: followingUserIds },
        })
        .sort({ createdAt: -1 })
        .limit(postPerPage)
        .skip(skip);
    } else if (filter == filtration.Oldest) {
      var posts = await this.postModel
        .find({
          user: { $in: followingUserIds },
        })
        .sort({ createdAt: 0 })
        .limit(postPerPage)
        .skip(skip);
    } else if (filter == filtration.MostLiked) {
      var posts = await this.postModel
        .find({
          user: { $in: followingUserIds },
        })
        .sort({ likes: -1 })
        .limit(postPerPage)
        .skip(skip);
    } else {
      var posts = await this.postModel
        .find({
          user: { $in: followingUserIds },
        })
        .limit(postPerPage)
        .skip(skip);
    }

    const postDtoArray: ViewPostDto[] = posts.map((post) => {
      const postDto = new ViewPostDto();
      const user = followingUsers.find(
        (followingUser) =>
          followingUser._id.toString() === post.user.toString(),
      );
      if (user) {
        postDto.user = `${user.fullName} (${user.username})`;
      } else {
        postDto.user = this.i18n.translate('translation.userNotFound', {
          lang,
        });
      }
      postDto.title = post.title;
      postDto.contents = post.contents;
      postDto.createdAt = post.createdAt;
      postDto.likes = post.likes.length;
      postDto.image = post.image;
      return postDto;
    });

    return postDtoArray;
  }

  async Wall(filter: filtration, query: Query, lang) {
    const postPerPage = Number(query.count) || 3;
    const currentPage = Number(query.page) || 1;
    const skip = postPerPage * (currentPage - 1);

    if (filter == filtration.Recent) {
      var post = await this.postModel
        .find()
        .sort({ createdAt: -1 })
        .limit(postPerPage)
        .skip(skip);
    } else if (filter == filtration.Oldest) {
      var post = await this.postModel
        .find()
        .sort({ createdAt: 0 })
        .limit(postPerPage)
        .skip(skip);
    } else if (filter == filtration.MostLiked) {
      var post = await this.postModel
        .find()
        .sort({ likes: -1 })
        .limit(postPerPage)
        .skip(skip);
    } else {
      var post = await this.postModel.find().limit(postPerPage).skip(skip);
    }

    const posts = post;
    if (!posts) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    const postDtoArray: ViewPostDto[] = [];

    for (const post of posts) {
      const postDto = new ViewPostDto();
      const user = await this.userModel.findById(post.user);
      if (user) {
        postDto.user = `${user.fullName} (${user.username})`;
      } else {
        postDto.user = this.i18n.translate('translation.userNotFound', {
          lang,
        });
      }
      postDto.title = post.title;
      postDto.contents = post.contents;
      postDto.createdAt = post.createdAt;
      postDto.likes = post.likes.length;
      postDto.image = post.image;

      postDtoArray.push(postDto);
    }

    return postDtoArray;
  }

  async LikePost(id: string, userId: string, lang: string) {
    const post = await this.postModel.findById(id);

    if (!post) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      const message = this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    if (post.likes.some((likedUser) => likedUser.toString() === userId)) {
      const message = this.i18n.translate(
        'translation.YouHaveAlreadyLikedThisPost',
        {
          lang,
        },
      );
      throw new BadRequestException(message);
    }

    post.likes.push(user);

    await post.save();

    return post;
  }
  async unLikePost(id: string, userId: string, lang: string) {
    const post = await this.postModel.findById(id);

    if (!post) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    const user = await this.userModel.findById(userId);

    if (!user) {
      const message = this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    if (post.likes.some((likedUser) => likedUser.toString() === userId)) {
      const index = post.likes.indexOf(user);
      post.likes.splice(index, 1);
      await post.save();

      return post;
    } else {
      const message = this.i18n.translate(
        'translation.YouAlreadyDoNotLikeThisPost',
        {
          lang,
        },
      );
      throw new BadRequestException(message);
    }
  }

  async getLikesForPost(postId: string, lang: string): Promise<User[]> {
    const post = await this.postModel
      .findById(postId)
      .populate('likes', 'fullName username');

    if (!post) {
      const message = await this.i18n.translate('translation.PostNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    return post.likes;
  }
}
