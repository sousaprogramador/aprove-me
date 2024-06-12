import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, JwtService, AuthService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
