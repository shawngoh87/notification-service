import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { NotificationChannelType, NotificationType } from '../domain/types';
import { IdentityModule } from '../../identity/identity.module';
import { IdentityRemoteService } from '../infra/remote-service/identity.remote-service';
import { NotificationTemplateRegistry } from './notification-template.registry';
import { NotificationChannelRegistry } from './notification-channel.registry';
import { User } from '../domain/entity/user.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockedIdentityRemoteService: jest.Mocked<IdentityRemoteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule],
      providers: [
        NotificationService,
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
});
