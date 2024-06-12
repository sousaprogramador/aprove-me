import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(login: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
      },
    });
  }

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { login } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  createToken(user: any) {
    const payload = { login: user.login, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
