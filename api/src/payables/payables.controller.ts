import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { PayablesService } from './payables.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('integration/payables')
export class PayablesController {
  constructor(
    @InjectQueue('payables') private readonly payablesQueue: Queue,
    private readonly payablesService: PayablesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPayableDto: CreatePayableDto) {
    return this.payablesService.create(createPayableDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.payablesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePayableDto: UpdatePayableDto,
  ) {
    return this.payablesService.update(id, updatePayableDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.payablesService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.payablesService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('batch')
  async createPayablesBatch(@Body() batch: { payables: any[]; email: string }) {
    if (batch.payables.length > 10000) {
      throw new Error('Batch size cannot exceed 10,000 payables');
    }
    await this.payablesQueue.add({
      payables: batch.payables,
      email: batch.email,
    });
    return { message: 'Batch received and is being processed' };
  }
}
