import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockJwtToken'),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const login = 'testuser';
      const password = 'testpassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = {
        id: '1',
        login,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(result);

      expect(await service.register(login, password)).toBe(result);
    });
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const login = 'testuser';
      const password = 'testpassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: '1',
        login,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.validateUser(login, password);
      expect(result).toEqual({
        id: '1',
        login,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    });
  });

  describe('createToken', () => {
    it('should create a JWT token', () => {
      const user = { id: '1', login: 'testuser' };
      const token = service.createToken(user);
      expect(token).toBe('mockJwtToken');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        login: user.login,
        sub: user.id,
      });
    });
  });
});
