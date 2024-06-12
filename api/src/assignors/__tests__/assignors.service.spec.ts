import { Test, TestingModule } from '@nestjs/testing';
import { AssignorsService } from '../assignors.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Assignor } from '@prisma/client';

const mockPrismaService = {
  assignor: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AssignorsService', () => {
  let service: AssignorsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AssignorsService>(AssignorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new assignor', async () => {
      const data = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test Assignor',
      };
      const result: Assignor = {
        id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.assignor.create.mockResolvedValue(result);

      expect(await service.create(data)).toBe(result);
      expect(mockPrismaService.assignor.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('findOne', () => {
    it('should return a single assignor', async () => {
      const result: Assignor = {
        id: '1',
        document: '12345678901',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test Assignor',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.assignor.findUnique.mockResolvedValue(result);

      expect(await service.findById('1')).toBe(result);
      expect(mockPrismaService.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update an assignor', async () => {
      const data = {
        document: '09876543210',
      };
      const result: Assignor = {
        id: '1',
        document: '09876543210',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test Assignor',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.assignor.update.mockResolvedValue(result);

      expect(await service.update('1', data)).toBe(result);
      expect(mockPrismaService.assignor.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data,
      });
    });
  });

  describe('remove', () => {
    it('should remove an assignor', async () => {
      const result: Assignor = {
        id: '1',
        document: '12345678901',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test Assignor',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.assignor.delete.mockResolvedValue(result);

      expect(await service.delete('1')).toBe(result);
      expect(mockPrismaService.assignor.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
