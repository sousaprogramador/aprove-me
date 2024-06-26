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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { AssignorsService } from './assignors.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('assignors')
@ApiBearerAuth()
@Controller('integration/assignors')
export class AssignorsController {
  constructor(private readonly assignorsService: AssignorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria um novo cedente' })
  @ApiResponse({ status: 201, description: 'Cedente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createAssignorDto: CreateAssignorDto) {
    return this.assignorsService.create(createAssignorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Busca um cedente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cedente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cedente não encontrado.' })
  async findById(@Param('id') id: string) {
    return this.assignorsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um cedente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cedente atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cedente não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateAssignorDto: UpdateAssignorDto,
  ) {
    return this.assignorsService.update(id, updateAssignorDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um cedente pelo ID' })
  @ApiResponse({ status: 200, description: 'Cedente deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cedente não encontrado.' })
  async delete(@Param('id') id: string) {
    return this.assignorsService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Busca todos os cedentes com paginação' })
  @ApiResponse({ status: 200, description: 'Cedentes encontrados.' })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.assignorsService.findAll(paginationDto);
  }
}
