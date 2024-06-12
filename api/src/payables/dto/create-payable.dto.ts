import { IsUUID, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreatePayableDto {
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @IsDate()
  @IsNotEmpty()
  emissionDate: Date;

  @IsUUID()
  @IsNotEmpty()
  assignorId: string;
}
