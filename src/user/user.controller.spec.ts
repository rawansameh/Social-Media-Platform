import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import mongoose from 'mongoose';
import { AuthGuard } from './user.guard';
import { I18nService } from 'nestjs-i18n';

jest.mock('./user.guard', () => ({
  AuthGuard: jest
    .fn()
    .mockImplementation(() => jest.fn((context, next) => next())),
}));

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: any;

  beforeEach(async () => {
    mockUserService = {
      createUser: jest
        .fn()
        .mockResolvedValue({ accessToken: 'mockAccessToken' }),
      login: jest.fn().mockResolvedValue({ accessToken: 'mockAccessToken' }),
    };
    const mockI18nService = {
      translate: jest
        .fn()
        .mockImplementation((key, options) => `Mocked translation for ${key}`),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should call UserService to create a user and return access token', async () => {
    const createUserDto = {
      username: 'test',
      password: 'password123',
      email: 'test@example.com',
      fullName: 'Test User',
      bio: 'A short bio',
      location: 'Test Location',
      occupation: 'Test Occupation',
      hobbies: ['Hobby 1', 'Hobby 2'],
    };
    const result = await controller.createUser(createUserDto);
    expect(result).toEqual({ accessToken: 'mockAccessToken' });
    expect(mockUserService.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should call UserService to login a user and return access token', async () => {
    const lang = 'en';

    const loginUserDto = { username: 'test', password: 'password123' };
    const result = await controller.login(loginUserDto, lang);
    expect(result).toEqual({ accessToken: 'mockAccessToken' });
    expect(mockUserService.login).toHaveBeenCalledWith(loginUserDto, lang);
  });
});
