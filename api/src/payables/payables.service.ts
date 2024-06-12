import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePayableDto } from './dto/create-payable.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';

@Injectable()
export class PayablesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePayableDto) {
    return this.prisma.payable.create({ data });
  }

  async findById(id: string) {
    return this.prisma.payable.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdatePayableDto) {
    return this.prisma.payable.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.payable.delete({ where: { id } });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [payables, total] = await this.prisma.$transaction([
      this.prisma.payable.findMany({
        skip,
        take: limit,
      }),
      this.prisma.payable.count(),
    ]);

    return {
      data: payables,
      total,
      page,
      limit,
    };
  }
}
