import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationChannelType, NotificationType } from '../domain/types';
import { IdentityModule } from '../../identity/identity.module';
import { IdentityRemoteService } from '../infra/remote-service/identity.remote-service';
import { NotificationTemplateRegistry } from './notification-template/notification-template.registry';
import { NotificationChannelRegistry } from './notification-channel/notification-channel.registry';
import { User } from '../domain/entity/user.entity';
import { UINotificationRepository } from '../infra/repository/ui-notification.repository';
import { UINotification } from '../domain/entity/ui-notification.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockedIdentityRemoteService: jest.Mocked<IdentityRemoteService>;
  let mockedUINotificationRepository: jest.Mocked<UINotificationRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule],
      providers: [
        NotificationService,
        {
          provide: UINotificationRepository,
          useValue: {
            listByUserId: jest.fn(),
          },
        },
        {
          provide: NotificationChannelRegistry,
          useFactory: () => {
            const registry = new NotificationChannelRegistry();
            registry.register(NotificationChannelType.UI, {
              send: jest.fn().mockResolvedValue(true),
            });
            return registry;
          },
        },
        {
          provide: NotificationTemplateRegistry,
          useFactory: () => {
            const registry = new NotificationTemplateRegistry();
            registry.register(NotificationType.LeaveBalanceReminder, {
              getSupportedChannels: jest
                .fn()
                .mockReturnValue([NotificationChannelType.UI]),
              getContent: jest.fn().mockReturnValue({
                content: 'Leave balance reminder',
              }),
            });
            return registry;
          },
        },
        {
          provide: IdentityRemoteService,
          useValue: {
            getUser: jest.fn().mockResolvedValue(
              User.create({
                id: '1',
                name: 'John Doe',
                company: {
                  id: '1',
                  name: 'Acme Corp',
                  channelSubscription: {
                    email: true,
                    ui: true,
                  },
                },
                channelSubscription: {
                  email: true,
                  ui: true,
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    mockedIdentityRemoteService = module.get<
      jest.Mocked<IdentityRemoteService>
    >(IdentityRemoteService);
    mockedUINotificationRepository = module.get<
      jest.Mocked<UINotificationRepository>
    >(UINotificationRepository);
  });

  describe('sendNotification', () => {
    it('should send notification to target channels', async () => {
      const result = await service.sendNotification({
        companyId: '1',
        userId: '1',
        notificationType: NotificationType.LeaveBalanceReminder,
      });

      expect(result).toEqual({
        sent: true,
        skipReason: null,
      });
    });

    it('should skip notification if user is not found', async () => {
      mockedIdentityRemoteService.getUser.mockResolvedValue(null);

      const result = await service.sendNotification({
        companyId: '1',
        userId: '2',
        notificationType: NotificationType.LeaveBalanceReminder,
      });

      expect(result).toEqual({
        sent: false,
        skipReason: 'user_not_found',
      });
    });
  });

  describe('listUiNotifications', () => {
    it('should list ui notifications', async () => {
      const uiNotification = UINotification.create({
        content: 'Leave balance reminder',
        companyId: '1',
        userId: '1',
      });
      mockedUINotificationRepository.listByUserId.mockResolvedValue([
        uiNotification,
      ]);

      const result = await service.listUiNotifications({
        companyId: '1',
        userId: '1',
      });

      expect(result).toEqual([uiNotification]);

      expect(mockedUINotificationRepository.listByUserId).toHaveBeenCalledWith({
        companyId: '1',
        userId: '1',
      });
    });
  });
});
