import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Login do usuário', example: 'user123' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
