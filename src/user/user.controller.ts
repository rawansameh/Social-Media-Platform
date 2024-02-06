import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Request,
  HttpException,
  Param,
  Patch,
  Delete,
  HttpStatus,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDto } from './dto/createuser.dto';
import { loginUserDto } from './dto/login.dto';
import { AuthGuard } from './user.guard';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/updateuser.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { I18nLang, I18nService } from 'nestjs-i18n';
import { ValidationError, validate } from 'class-validator';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly i18n: I18nService,
  ) {}
  @Post('/signup')
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserdto: createUserDto) {
    console.log(createUserdto);

    return this.userService.createUser(createUserdto);
  }

  @Get()
  getUsers(@Query() query: ExpressQuery, @I18nLang() lang) {
    return this.userService.getUsers(query, lang);
  }
  @Post('/login')
  login(@Body() loginUserdto: loginUserDto, @I18nLang() lang: string) {
    return this.userService.login(loginUserdto, lang);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('profile/:id')
  async getUserById(
    @Request() req,
    @Param('id') id: string,
    @I18nLang() lang: string,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    const message = await this.i18n.translate('translation.userNotFound', {
      lang,
    });
    if (!isValid) throw new HttpException(message, 404);
    const findUser = await this.userService.getUsersByID(id, lang);
    if (!findUser) throw new HttpException(message, 404);
    return findUser;
  }

  @UseGuards(AuthGuard)
  @Patch('profile/update')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @I18nLang() lang: string,
  ) {
    const updatedUser = await this.userService.updateUser(
      req.user.id,
      updateUserDto,
      lang,
    );
    return updatedUser;
  }

  @Delete('profile/delete')
  @UseGuards(AuthGuard)
  async deleteUser(@Request() req, @I18nLang() lang: string) {
    const result = await this.userService.deleteUser(
      req.user.id.toString(),
      lang,
    );
    if (!result) {
      const message = await this.i18n.translate('translation.userNotFound', {
        lang,
      });
      throw new HttpException(message, 404);
    }

    return {
      message: await this.i18n.translate(
        'translation.userDeletedSuccessfully',
        { lang },
      ),
    };
  }

  @Post('profile/follow/:id')
  @UseGuards(AuthGuard)
  async followUser(
    @Request() req,
    @Param('id') userIdToFollow: string,
    @I18nLang() lang: string,
  ) {
    try {
      const followerId = req.user.id;

      const result = await this.userService.followUser(
        followerId,
        userIdToFollow,
        lang,
      );

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('profile/unfollow/:id')
  @UseGuards(AuthGuard)
  async unfollowUser(
    @Request() req,
    @Param('id') userIdToFollow: string,
    @I18nLang() lang: string,
  ) {
    try {
      const followerId = req.user.id;

      const result = await this.userService.unfollowUser(
        followerId,
        userIdToFollow,
        lang,
      );

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('profile/deactivate')
  @UseGuards(AuthGuard)
  async deactivateUser(@Request() req, @I18nLang() lang: string) {
    const deactivateUser = await this.userService.deactivateUser(
      req.user.id,
      lang,
    );
    if (!deactivateUser)
      throw new HttpException(
        this.i18n.translate('translation.userNotFound', {
          lang,
        }),
        404,
      );
    return deactivateUser;
  }
  @Post('profile/activate')
  @UseGuards(AuthGuard)
  async activateUser(@Request() req, @I18nLang() lang: string) {
    const deactivateUser = await this.userService.activateUser(
      req.user.id,
      lang,
    );
    if (!deactivateUser)
      throw new HttpException(
        this.i18n.translate('translation.userNotFound', {
          lang,
        }),
        404,
      );
    return deactivateUser;
  }
}
