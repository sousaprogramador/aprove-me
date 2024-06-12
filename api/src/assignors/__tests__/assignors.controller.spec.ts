import { Test, TestingModule } from '@nestjs/testing';
import { AssignorsController } from '../assignors.controller';
import { AssignorsService } from '../assignors.service';
import { CreateAssignorDto } from '../dto/create-assignor.dto';
import { UpdateAssignorDto } from '../dto/update-assignor.dto';
import { Assignor } from '@prisma/client';

describe('AssignorsController', () => {
  let controller: AssignorsController;
  let assignorsService: AssignorsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorsController],
      providers: [
        {
          provide: AssignorsService,
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

    controller = module.get<AssignorsController>(AssignorsController);
    assignorsService = module.get<AssignorsService>(AssignorsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new assignor', async () => {
      const createAssignorDto: CreateAssignorDto = {
        document: '12345678901',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test Assignor',
      };
      const result: Assignor = {
        id: '1',
        document: '12345678901',
        email: 'test@example.com',
        phone: '1234567890',
        name: 'Test Assignor',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(assignorsService, 'create').mockResolvedValueOnce(result);

      expect(await controller.create(createAssignorDto)).toBe(result);
      expect(assignorsService.create).toHaveBeenCalledWith(createAssignorDto);
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

      jest.spyOn(assignorsService, 'findById').mockResolvedValue(result);

      expect(await controller.findById('1')).toBe(result);
      expect(assignorsService.findById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an assignor', async () => {
      const updateAssignorDto: UpdateAssignorDto = {
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

      jest.spyOn(assignorsService, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateAssignorDto)).toBe(result);
      expect(assignorsService.update).toHaveBeenCalledWith(
        '1',
        updateAssignorDto,
      );
    });
  });
});
