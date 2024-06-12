/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
          },
        },
        { provide: AuthService, useValue: { login: jest.fn() } },
        PrismaService,
        JwtService,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'testuser',
        password: 'testpassword',
      };
      const result: User = {
        id: '1',
        login: 'testuser',
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(usersService, 'register').mockResolvedValueOnce(result);

      expect(await controller.register(createUserDto)).toBe(result);
      expect(usersService.register).toHaveBeenCalledWith(
        'testuser',
        'testpassword',
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const loginDto: LoginDto = {
        login: 'testuser',
        password: 'testpassword',
      };
      const result = { access_token: 'mockJwtToken' };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(result);

      expect(await controller.login(loginDto)).toBe(result);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
