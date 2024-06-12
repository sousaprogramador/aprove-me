import { Test, TestingModule } from '@nestjs/testing';
import { PayablesController } from '../payables.controller';
import { PayablesService } from '../payables.service';
import { CreatePayableDto } from '../dto/create-payable.dto';
import { UpdatePayableDto } from '../dto/update-payable.dto';
import { Payable } from '@prisma/client';
import { Queue } from 'bull';
import { BullModule } from '@nestjs/bull';

describe('PayablesController', () => {
  let controller: PayablesController;
  let payablesService: PayablesService;
  //let queue: Queue;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'payables',
        }),
      ],
      controllers: [PayablesController],
      providers: [
        {
          provide: PayablesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PayablesController>(PayablesController);
    payablesService = module.get<PayablesService>(PayablesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new payable', async () => {
      const createPayableDto: CreatePayableDto = {
        value: 1000,
        emissionDate: new Date(),
        assignorId: '1',
      };
      const result: Payable = {
        ...createPayableDto,
        id: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(payablesService, 'create').mockResolvedValueOnce(result);

      expect(await controller.create(createPayableDto)).toBe(result);
      expect(payablesService.create).toHaveBeenCalledWith(createPayableDto);
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

      jest.spyOn(payablesService, 'findById').mockResolvedValueOnce(result);

      expect(await controller.findById('1')).toBe(result);
      expect(payablesService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a payable', async () => {
      const updatePayableDto: UpdatePayableDto = {
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

      jest.spyOn(payablesService, 'update').mockResolvedValueOnce(result);

      expect(await controller.update('1', updatePayableDto)).toBe(result);
      expect(payablesService.update).toHaveBeenCalledWith(
        '1',
        updatePayableDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a payable', async () => {
      jest.spyOn(payablesService, 'delete').mockResolvedValue(null);

      expect(await controller.delete('1')).toBe(null);
      expect(payablesService.delete).toHaveBeenCalledWith('1');
    });
  });
});
