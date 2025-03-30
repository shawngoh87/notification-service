import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { NotificationType } from './../src/notification/domain/types';
import { Connection, disconnect } from 'mongoose';
import { getDatabaseConnectionToken } from '../src/common/database.providers';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let consoleSpy: jest.SpyInstance;
  let connection: Connection;
  let db: Connection['db'];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    connection = app.get(getDatabaseConnectionToken());
    if (!connection.db) {
      throw new Error('Database connection not found');
    }

    db = connection.db;
  });

  beforeEach(async () => {
    // Drop all collections before each test
    if (db) {
      const collections = await db.collections();

      for (const collection of collections) {
        await collection.drop().catch((err) => {
          console.error(
            `Error dropping collection ${collection.collectionName}:`,
            err,
          );
        });
      }
    } else {
      console.error('No database connection available for cleanup');
    }

    consoleSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  afterAll(async () => {
    await disconnect();
    await app.close();
  });

  describe('sending different types of notifications', () => {
    it('should send a leave balance reminder notification', async () => {
      await request(app.getHttpServer())
        .post('/api/notification/send')
        .send({
          companyId: '1',
          userId: '1',
          notificationType: NotificationType.LeaveBalanceReminder,
        })
        .expect(201);

      const uiNotifications = await db
        ?.collection('ui_notifications')
        .find({})
        .toArray();

      expect(uiNotifications).toHaveLength(1);
      expect(uiNotifications?.[0]).toEqual(
        expect.objectContaining({
          companyId: '1',
          userId: '1',
          content: 'Remember to book your leaves, John Doe',
        }),
      );
    });

    it('should send a monthly payslip notification', async () => {
      await request(app.getHttpServer())
        .post('/api/notification/send')
        .send({
          companyId: '1',
          userId: '1',
          notificationType: NotificationType.MonthlyPayslip,
        })
        .expect(201);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Subject',
        'Your monthly payslip is ready',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Content',
        'Your monthly payslip is ready, John Doe',
      );
    });

    it('should send a happy birthday notification', async () => {
      await request(app.getHttpServer())
        .post('/api/notification/send')
        .send({
          companyId: '1',
          userId: '1',
          notificationType: NotificationType.HappyBirthday,
        })
        .expect(201);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Subject',
        'Happy Birthday, John Doe',
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Content',
        'Acme Corp wishes you a happy birthday, John Doe!',
      );

      const uiNotifications = await connection.db
        ?.collection('ui_notifications')
        .find({})
        .toArray();

      expect(uiNotifications).toHaveLength(1);
      expect(uiNotifications?.[0].content).toEqual(
        'Acme Corp wishes you a happy birthday, John Doe!',
      );
    });
  });

  describe('listing ui notifications', () => {
    it('should list ui notifications', async () => {
      await db?.collection('ui_notifications').insertMany([
        {
          content: 'Test',
          companyId: '1',
          userId: '1',
        },
        {
          content: 'Test 2',
          companyId: '1',
          userId: '1',
        },
      ]);

      const response = await request(app.getHttpServer())
        .get('/api/notification/list-ui-notifications')
        .query({
          companyId: '1',
          userId: '1',
        })
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ content: 'Test' }),
          expect.objectContaining({ content: 'Test 2' }),
        ]),
      );
    });
  });
});
