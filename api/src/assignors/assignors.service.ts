import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';

@Injectable()
export class AssignorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAssignorDto) {
    return this.prisma.assignor.create({ data });
  }

  async findById(id: string) {
    return this.prisma.assignor.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateAssignorDto) {
    return this.prisma.assignor.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.assignor.delete({ where: { id } });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [assignors, total] = await this.prisma.$transaction([
      this.prisma.assignor.findMany({
        skip,
        take: limit,
      }),
      this.prisma.assignor.count(),
    ]);

    return {
      data: assignors,
      total,
      page,
      limit,
    };
  }
}
