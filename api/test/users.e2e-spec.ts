import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/users/register')
        .send({ login: 'testuser', password: 'testpassword' })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('login', 'testuser');
        });
    });

    it('should login a user', () => {
      return request(app.getHttpServer())
        .post('/users/login')
        .send({ login: 'testuser', password: 'testpassword' })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
        });
    });
  });
});
