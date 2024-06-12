import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PayablesController } from './payables.controller';
import { PayablesService } from './payables.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payables',
    }),
    PrismaModule,
  ],
  controllers: [PayablesController],
  providers: [PayablesService],
})
export class PayablesModule {}
