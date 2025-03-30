import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { NotificationType } from './../src/notification/domain/types';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('sending different types of notifications', () => {
    it('should send a happy birthday notification', () => {
      return request(app.getHttpServer())
        .post('/api/notification/send')
        .send({
          companyId: '1',
          userId: '1',
          notificationType: NotificationType.HappyBirthday,
        })
        .expect(201);
    });

    it('should send a leave balance reminder notification', () => {
      return request(app.getHttpServer())
        .post('/api/notification/send')
        .send({
          companyId: '1',
          userId: '1',
          notificationType: NotificationType.LeaveBalanceReminder,
        })
        .expect(201);
    });

    it('should send a monthly payslip notification', () => {
      return request(app.getHttpServer())
        .post('/api/notification/send')
        .send({
          companyId: '1',
          userId: '1',
          notificationType: NotificationType.MonthlyPayslip,
        })
        .expect(201);
    });
  });
});
