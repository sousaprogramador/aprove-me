import { IsUUID, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayableDto {
  @ApiProperty({ description: 'Valor do pagável', example: 1000.0 })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    description: 'Data de emissão do pagável',
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDate()
  @IsNotEmpty()
  emissionDate: Date;

  @ApiProperty({
    description: 'ID do cedente',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  assignorId: string;
}
