import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { NotificationModule } from '../notification.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { Server } from 'node:http';
import { NotificationType } from '../domain/types';

describe('NotificationController', () => {
  let app: INestApplication<Server>;
  let notificationService: jest.Mocked<NotificationService>;
  let server: Server;

  beforeEach(async () => {
    const mockNotificationService = {
      sendNotification: jest.fn().mockResolvedValue({
        sent: true,
        skipReason: null,
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        NotificationModule,
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
    })
      .overrideProvider(NotificationService)
      .useValue(mockNotificationService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    notificationService = moduleFixture.get(NotificationService);
    await app.init();
    server = app.getHttpServer();
  });

  afterEach(async () => {
    await app.close();
    server.close();
  });

  it('true', () => {
    expect(true).toBe(true);
  });

  describe('POST /notification/send', () => {
    it('success', async () => {
      const response = await request(server)
        .post('/notification/send')
        .send({
          companyId: '123',
          userId: '456',
          notificationType: NotificationType.LeaveBalanceReminder,
        })
        .expect(201);

      expect(response.body).toEqual({
        sent: true,
        skipReason: null,
      });

      expect(notificationService.sendNotification).toHaveBeenCalledWith({
        companyId: '123',
        userId: '456',
        notificationType: NotificationType.LeaveBalanceReminder,
      });
    });

    describe('validation', () => {
      let body: {
        companyId: string;
        userId: string;
        notificationType: NotificationType;
      };

      beforeEach(() => {
        body = {
          companyId: '123',
          userId: '456',
          notificationType: NotificationType.LeaveBalanceReminder,
        };
      });

      const expect400 = async (body: {
        companyId: string;
        userId: string;
        notificationType: NotificationType;
      }) => {
        await request(server).post('/notification/send').send(body).expect(400);
      };

      describe('companyId', () => {
        it('should invalidate missing companyId', async () => {
          // @ts-expect-error
          delete body.companyId;
          await expect400(body);
        });

        it('should invalidate empty companyId', async () => {
          body.companyId = '';
          await expect400(body);
        });
      });

      describe('userId', () => {
        it('should invalidate missing userId', async () => {
          // @ts-expect-error
          delete body.userId;
          await expect400(body);
        });

        it('should invalidate empty userId', async () => {
          body.userId = '';
          await expect400(body);
        });
      });

      describe('notificationType', () => {
        it('should invalidate missing notificationType', async () => {
          // @ts-expect-error
          delete body.notificationType;
          await expect400(body);
        });

        it('should invalidate invalid notificationType', async () => {
          // @ts-expect-error
          body.notificationType = 'invalid';
          await expect400(body);
        });
      });
    });
  });
});
