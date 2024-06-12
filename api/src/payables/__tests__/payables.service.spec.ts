import { Test, TestingModule } from '@nestjs/testing';
import { PayablesService } from '../payables.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Payable } from '@prisma/client';

const mockPrismaService = {
  payable: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('PayablesService', () => {
  let service: PayablesService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayablesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PayablesService>(PayablesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new payable', async () => {
      const data = {
        value: 1000,
        emissionDate: new Date(),
        assignorId: '1',
      };
      const result: Payable = {
        id: '1',
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.payable.create.mockResolvedValue(result);

      expect(await service.create(data)).toBe(result);
      expect(mockPrismaService.payable.create).toHaveBeenCalledWith({ data });
    });
  });

  describe('findOne', () => {
    it('should return a single payable', async () => {
      const result: Payable = {
        id: '1',
        value: 1000,
        emissionDate: new Date(),
        assignorId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.payable.findUnique.mockResolvedValue(result);

      expect(await service.findById('1')).toBe(result);
      expect(mockPrismaService.payable.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('update', () => {
    it('should update a payable', async () => {
      const data = {
        value: 2000,
      };
      const result: Payable = {
        id: '1',
        value: 2000,
        emissionDate: new Date(),
        assignorId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.payable.update.mockResolvedValue(result);

      expect(await service.update('1', data)).toBe(result);
      expect(mockPrismaService.payable.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data,
      });
    });
  });

  describe('remove', () => {
    it('should remove a payable', async () => {
      const result: Payable = {
        id: '1',
        value: 1000,
        emissionDate: new Date(),
        assignorId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.payable.delete.mockResolvedValue(result);

      expect(await service.delete('1')).toBe(result);
      expect(mockPrismaService.payable.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
