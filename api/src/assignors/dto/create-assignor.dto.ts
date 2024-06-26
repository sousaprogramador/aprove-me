import { IsNotEmpty, IsString, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignorDto {
  @ApiProperty({
    description: 'Documento do cedente (CPF ou CNPJ)',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  document: string;

  @ApiProperty({
    description: 'Email do cedente',
    example: 'assignor@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 140)
  email: string;

  @ApiProperty({ description: 'Telefone do cedente', example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;

  @ApiProperty({
    description: 'Nome ou razão social do cedente',
    example: 'Assignor Name',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 140)
  name: string;
}
