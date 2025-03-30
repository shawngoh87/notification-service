import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { UINotificationRepository } from './ui-notification.repository';
import {
  UI_NOTIFICATION_DOCUMENT,
  UINotificationSchema,
  UINotificationCollectionName,
} from './ui-notification.document';
import { UINotificationDocument } from './ui-notification.document';
import { UINotification } from '../../domain/entity/ui-notification.entity';
import { DatabaseModule } from '../../../common/database.module';
import { getDatabaseConnectionToken } from '../../../common/database.providers';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { existsSync } from 'fs';
import { ObjectId } from 'bson';

describe('UINotificationRepository', () => {
  let repository: UINotificationRepository;
  let model: Model<UINotificationDocument>;
  let connection: Connection;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        ConfigModule.forRoot({
          envFilePath: existsSync(
            `${process.cwd()}/.env.${process.env.NODE_ENV}`,
          )
            ? `${process.cwd()}/.env.${process.env.NODE_ENV}`
            : `${process.cwd()}/.env`,
          isGlobal: true,
        }),
      ],
      providers: [
        UINotificationRepository,
        {
          provide: UI_NOTIFICATION_DOCUMENT,
          useFactory: (connection: Connection) => {
            return connection.model(
              UINotificationCollectionName,
              UINotificationSchema,
            );
          },
          inject: [getDatabaseConnectionToken()],
        },
      ],
    }).compile();

    repository = module.get<UINotificationRepository>(UINotificationRepository);
    model = module.get<Model<UINotificationDocument>>(UI_NOTIFICATION_DOCUMENT);
    connection = module.get<Connection>(getDatabaseConnectionToken());
  });

  beforeEach(async () => {
    await model.deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('create', () => {
    it('should create a new UI notification', async () => {
      const notification = UINotification.create({
        companyId: 'company-123',
        userId: 'user-123',
        content: 'Test notification',
      });

      const result = await repository.create(notification);

      const savedNotification = await model.findOne({
        _id: new ObjectId(result.toPlainObject().id),
      });
      expect(savedNotification).not.toBeNull();
      expect(savedNotification?.content).toBe('Test notification');
      expect(savedNotification?.companyId).toBe('company-123');
      expect(savedNotification?.userId).toBe('user-123');
      expect(result).toEqual(notification);
    });
  });

  describe('listByUserId', () => {
    it('should list notifications for a specific user in a company', async () => {
      const notifications = [
        UINotification.create({
          content: 'First notification',
          companyId: 'company-123',
          userId: 'user-123',
        }),
        UINotification.create({
          content: 'Second notification',
          companyId: 'company-123',
          userId: 'user-123',
        }),
        UINotification.create({
          content: 'Other user notification',
          companyId: 'company-123',
          userId: 'other-user',
        }),
      ];

      await model.insertMany(
        notifications.map((n) => ({
          _id: new ObjectId(n.toPlainObject().id),
          content: n.toPlainObject().content,
          companyId: n.toPlainObject().companyId,
          userId: n.toPlainObject().userId,
        })),
      );

      const params = {
        companyId: 'company-123',
        userId: 'user-123',
      };

      const result = await repository.listByUserId(params);

      expect(result).toHaveLength(2);
      expect(result[0].toPlainObject().companyId).toBe('company-123');
      expect(result[0].toPlainObject().userId).toBe('user-123');
      expect(result[0].toPlainObject().content).toBe('First notification');
      expect(result[1].toPlainObject().companyId).toBe('company-123');
      expect(result[1].toPlainObject().userId).toBe('user-123');
      expect(result[1].toPlainObject().content).toBe('Second notification');
    });
  });
});
