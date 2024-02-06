import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

describe('UserService', () => {
  let service: UserService;
  let jwtServiceMock: any;

  const mockSave = jest.fn();
  const userModelMock = {
    create: jest.fn().mockImplementation((doc) => Promise.resolve(doc)),
    findOne: jest.fn().mockImplementation((query) => {
      return {
        exec: jest.fn().mockResolvedValue({ _id: 'someId', ...query }),
      };
    }),
  };

  const mockPostModel = {
    find: jest.fn().mockResolvedValue([]),
  };

  const mockI18nService = {
    translate: jest
      .fn()
      .mockImplementation((key, options) => `Mocked translation for ${key}`),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    jwtServiceMock = {
      signAsync: jest.fn().mockResolvedValue('mockAccessToken'),
    };
    userModelMock.findOne.mockReset().mockImplementation(({ username }) => {
      if (username === 'existingUser') {
        return {
          exec: jest.fn().mockResolvedValue({
            _id: 'mockUserId',
            username,
            password: bcrypt.hashSync('password', 10),
          }),
        };
      } else {
        return { exec: jest.fn().mockResolvedValue(null) };
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModelMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: getModelToken('Post'), useValue: mockPostModel },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('createUser', () => {
    it('should successfully create a user and return an access token', async () => {
      const createUserDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
      };
      userModelMock.create.mockResolvedValue({
        _id: 'mockUserId',
        ...createUserDto,
        password: expect.any(String),
        active: true,
      });

      const result = await service.createUser(createUserDto);

      expect(result).toHaveProperty('accessToken');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        id: 'mockUserId',
      });
    });
  });

  describe('login', () => {
    const lang = 'en';
    it('should throw an error if username is not found', async () => {
      userModelMock.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });
      await expect(
        service.login(
          { username: 'wronguser', password: 'testpassword' },
          lang,
        ),
      ).rejects.toThrow(NotFoundException);
      expect(mockI18nService.translate).toHaveBeenCalledWith(
        'translation.invalidUsernameOrPassword',
        { lang: 'en' },
      );
    });

    it('should throw an error if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      userModelMock.findOne.mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValue({
            _id: 'mockUserId',
            username: 'testuser',
            password: hashedPassword,
          }),
      });
      await expect(
        service.login(
          { username: 'testuser', password: 'wrongpassword' },
          lang,
        ),
      ).rejects.toThrow(UnauthorizedException);
      expect(mockI18nService.translate).toHaveBeenCalledWith(
        'translation.invalidUsernameOrPassword',
        { lang: 'en' },
      );
    });

    it('should return an access token on successful login', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      userModelMock.findOne.mockReturnValueOnce({
        exec: jest
          .fn()
          .mockResolvedValue({
            _id: 'mockUserId',
            username: 'testuser',
            password: hashedPassword,
          }),
      });
      const result = await service.login(
        { username: 'testuser', password: 'correctpassword' },
        lang,
      );
      expect(result).toHaveProperty('accessToken', 'mockAccessToken');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        id: 'mockUserId',
      });
    });
  });
});
