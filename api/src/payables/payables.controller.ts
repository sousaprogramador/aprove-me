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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Queue } from 'bull';
import { CreatePayableDto } from './dto/create-payable.dto';
import { UpdatePayableDto } from './dto/update-payable.dto';
import { PayablesService } from './payables.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('integrations')
@ApiBearerAuth()
@Controller('integration/payables')
export class PayablesController {
  constructor(
    @InjectQueue('payables') private readonly payablesQueue: Queue,
    private readonly payablesService: PayablesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo pagável' })
  @ApiResponse({ status: 201, description: 'Pagável criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createPayableDto: CreatePayableDto) {
    return this.payablesService.create(createPayableDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Busca um pagável pelo ID' })
  @ApiResponse({ status: 200, description: 'Pagável encontrado.' })
  @ApiResponse({ status: 404, description: 'Pagável não encontrado.' })
  async findById(@Param('id') id: string) {
    return this.payablesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um pagável pelo ID' })
  @ApiResponse({ status: 200, description: 'Pagável atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pagável não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updatePayableDto: UpdatePayableDto,
  ) {
    return this.payablesService.update(id, updatePayableDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um pagável pelo ID' })
  @ApiResponse({ status: 200, description: 'Pagável deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pagável não encontrado.' })
  async delete(@Param('id') id: string) {
    return this.payablesService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Busca todos os pagáveis' })
  @ApiResponse({ status: 200, description: 'Pagáveis encontrados.' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.payablesService.findAll(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('batch')
  @ApiOperation({ summary: 'Cria um lote de pagáveis' })
  @ApiResponse({
    status: 202,
    description: 'Lote recebido e em processamento.',
  })
  @ApiResponse({
    status: 400,
    description: 'Tamanho do lote não pode exceder 10.000 pagáveis.',
  })
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
