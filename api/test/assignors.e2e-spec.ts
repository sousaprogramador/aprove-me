import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Assignors (e2e)', () => {
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
    await prisma.assignor.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/assignors (POST)', () => {
    it('should create a new assignor', () => {
      return request(app.getHttpServer())
        .post('/assignors')
        .send({
          document: '12345678901',
          email: 'assignor@example.com',
          phone: '1234567890',
          name: 'Test Assignor',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('document', '12345678901');
        });
    });

    it('should get all assignors', () => {
      return request(app.getHttpServer())
        .get('/assignors')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('should get a single assignor', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          document: '12345678901',
          email: 'assignor@example.com',
          phone: '1234567890',
          name: 'Test Assignor',
        },
      });

      return request(app.getHttpServer())
        .get(`/assignors/${assignor.id}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('id', assignor.id);
        });
    });
  });
});
