import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Payables (e2e)', () => {
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
    await prisma.payable.deleteMany({});
    await prisma.assignor.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/payables (POST)', () => {
    it('should create a new payable', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          document: '12345678901',
          email: 'assignor@example.com',
          phone: '1234567890',
          name: 'Test Assignor',
        },
      });

      return request(app.getHttpServer())
        .post('/payables')
        .send({
          value: 1000,
          emissionDate: new Date().toISOString(),
          assignorId: assignor.id,
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('value', 1000);
        });
    });

    it('should get all payables', () => {
      return request(app.getHttpServer())
        .get('/payables')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('should get a single payable', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          document: '12345678901',
          email: 'assignor@example.com',
          phone: '1234567890',
          name: 'Test Assignor',
        },
      });

      const payable = await prisma.payable.create({
        data: {
          value: 1000,
          emissionDate: new Date(),
          assignorId: assignor.id,
        },
      });

      return request(app.getHttpServer())
        .get(`/payables/${payable.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', payable.id);
        });
    });
  });
});
