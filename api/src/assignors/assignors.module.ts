import { Module } from '@nestjs/common';
import { AssignorsController } from './assignors.controller';
import { AssignorsService } from './assignors.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AssignorsController],
  providers: [AssignorsService],
})
export class AssignorsModule {}
