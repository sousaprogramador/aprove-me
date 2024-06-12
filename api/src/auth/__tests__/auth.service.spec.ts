import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from '../../users/dto/login.dto';

const mockUsersService = {
  validateUser: jest.fn(),
  createToken: jest.fn().mockReturnValue('mockJwtToken'),
};

const mockJwtService = {};

const mockPrismaService = {};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user', async () => {
      const login = 'testuser';
      const password = 'testpassword';
      const user = { id: '1', login };

      mockUsersService.validateUser.mockResolvedValue(user);

      const result = await service.validateUser(login, password);
      expect(result).toEqual(user);
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        login,
        password,
      );
    });

    it('should return null if validation fails', async () => {
      const login = 'testuser';
      const password = 'wrongpassword';

      mockUsersService.validateUser.mockResolvedValue(null);

      const result = await service.validateUser(login, password);
      expect(result).toBeNull();
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        login,
        password,
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const loginDto: LoginDto = {
        login: 'testuser',
        password: 'testpassword',
      };
      const user = { id: '1', login: 'testuser' };

      mockUsersService.validateUser.mockResolvedValue(user);

      const result = await service.login(loginDto);
      expect(result).toEqual({ access_token: 'mockJwtToken' });
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        loginDto.login,
        loginDto.password,
      );
      expect(mockUsersService.createToken).toHaveBeenCalledWith(user);
    });

    it('should throw an error if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        login: 'testuser',
        password: 'testpassword',
      };

      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });
});
