import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ViewProfileDto } from './dto/viewprofiledto';
import { UpdateUserDto } from './dto/updateuser.dto';
import mongoose from 'mongoose';
import { Document, Schema, ObjectId } from 'mongoose';
import { Post } from '../schemas/posts.schema';
import { Query } from 'express-serve-static-core';
import { I18nLang, I18nService } from 'nestjs-i18n';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Post.name) private postModel: Model<Post>,
    private readonly i18n: I18nService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createUser(createUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      active: true,
    });

    const payload = { id: user._id };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginUserDto, lang: string) {
    const { username, password } = loginUserDto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      const message = await this.i18n.translate(
        'translation.invalidUsernameOrPassword',
        {
          lang,
        },
      );
      throw new NotFoundException(message);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(
        this.i18n.translate('translation.invalidUsernameOrPassword', {
          lang,
        }),
      );
    }

    const payload = {
      id: user._id,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
  getUsers(query: Query, lang: string) {
    const userPerPage = 3;
    const currentPage = Number(query.page) || 1;
    const skip = userPerPage * (currentPage - 1);

    const user = this.userModel.find().limit(userPerPage).skip(skip);

    if (!user) {
      const message = this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }
    return user;
  }

  async getUsersByID(id: string, lang: string): Promise<ViewProfileDto> {
    const user = await this.userModel.findById({ _id: id, active: true });
    console.log(lang);
    if (!user) {
      const message = await this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }
    const userProfile = new ViewProfileDto();
    userProfile.username = user.username;
    userProfile.email = user.email;
    userProfile.fullName = user.fullName;
    userProfile.bio = user.bio;
    userProfile.location = user.location;
    userProfile.occupation = user.occupation;
    userProfile.hobbies = user.hobbies;

    const followingUserIds = user.following
      .filter((followingUser) => followingUser?.type?.path)
      .map((followingUser) => followingUser.type.path.toString());

    const followingUsers = await this.userModel.find(
      { _id: { $in: followingUserIds } },
      'username',
    );

    userProfile.following = followingUsers.map(
      (followingUser) => followingUser.username,
    );

    const posts = await this.postModel.find({ _id: { $in: user.posts } });

    userProfile.posts = posts.map(
      (post) => `${post.title}: ${post.contents} ${post.image}`,
    );

    return userProfile;
  }

  updateUser(id: string, updateUserDto: UpdateUserDto, lang: string) {
    const user = this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) {
      const message = this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }
    return user;
  }

  deleteUser(id: string, lang) {
    const user = this.userModel.findByIdAndDelete(id); //deleteOne({ _id: id });//
    if (!user) {
      const message = this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }
    return user;
  }

  async followUser(
    followerId: string,
    userIdToFollow: string,
    lang: string,
  ): Promise<any> {
    const follower = await this.userModel.findById(followerId);

    if (!follower) {
      const message = this.i18n.translate('translation.followerNotFound', {
        lang,
      });
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }

    const userIdToFollowObjectId = new mongoose.Schema.Types.ObjectId(
      userIdToFollow,
    );

    const userIdToFollowString = userIdToFollow.toString();
    const followerFollowingStrings = follower.following.map((entry) =>
      entry.type.path.toString(),
    );

    if (followerFollowingStrings.includes(userIdToFollowString)) {
      return {
        message: this.i18n.translate('translation.alreadyFollowingUser', {
          lang,
        }),
      };
    } else {
      const followingEntry = {
        type: userIdToFollowObjectId,
        ref: 'User' as const,
      };
      follower.following.push(followingEntry);
      await follower.save();
      return {
        message: this.i18n.translate('translation.followedSuccessfully', {
          lang,
        }),
      };
    }
  }

  async unfollowUser(
    followerId: string,
    userIdToUnFollow: string,
    lang: string,
  ): Promise<any> {
    const follower = await this.userModel.findById(followerId);
    if (!follower) {
      const message = this.i18n.translate('translation.followerNotFound', {
        lang,
      });
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }

    const userIdToFollowObjectId = new mongoose.Schema.Types.ObjectId(
      userIdToUnFollow,
    );

    const userIdToFollowString = userIdToUnFollow.toString();
    const followerFollowingStrings = follower.following.map((entry) =>
      entry.type.path.toString(),
    );

    if (followerFollowingStrings.includes(userIdToFollowString)) {
      const followingEntry = {
        type: userIdToFollowObjectId,
        ref: 'User' as const,
      };
      const index = follower.following.indexOf(followingEntry);
      follower.following.splice(index, 1);

      await follower.save();
      return {
        message: this.i18n.translate('translation.unfollowedSuccessfully', {
          lang,
        }),
      };
    } else {
      return {
        message: this.i18n.translate('translation.userNotInFollowingList', {
          lang,
        }),
      };
    }
  }

  async deactivateUser(id: string, lang: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { active: false });

    if (!user) {
      const message = this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    return {
      message: this.i18n.translate('translation.userDeactivatedSuccessfully', {
        lang,
      }),
    };
  }

  async activateUser(id: string, lang: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { active: true });

    if (!user) {
      const message = this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new NotFoundException(message);
    }

    return {
      message: this.i18n.translate('translation.userActivatedSuccessfully', {
        lang,
      }),
    };
  }
}
