import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import {
  UI_NOTIFICATION_DOCUMENT,
  UINotificationSchema,
  UINotificationCollectionName,
} from './infra/repository/ui-notification.document';
import { getDatabaseConnectionToken } from '../common/database.providers';
import { DatabaseModule } from '../common/database.module';
import { NotificationController } from './application/notification.controller';
import { NotificationService } from './application/notification.service';
import { IdentityModule } from '../identity/identity.module';
import { IdentityRemoteService } from './infra/remote-service/identity.remote-service';
import { NotificationChannelRegistry } from './application/notification-channel/notification-channel.registry';
import { NotificationTemplateRegistry } from './application/notification-template/notification-template.registry';
import { NotificationType, NotificationChannelType } from './domain/types';
import { LeaveBalanceReminderNotificationTemplate } from './application/notification-template/leave-balance-reminder';
import { UINotificationRepository } from './infra/repository/ui-notification.repository';
import { UINotificationChannel } from './application/notification-channel/ui';
import { EmailNotificationChannel } from './application/notification-channel/email';
import { MonthlyPayslipNotificationTemplate } from './application/notification-template/monthly-payslip';
import { HappyBirthdayNotificationTemplate } from './application/notification-template/happy-birthday';

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [NotificationController],
  providers: [
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
    {
      provide: NotificationChannelRegistry,
      useFactory: (repository: UINotificationRepository) => {
        const registry = new NotificationChannelRegistry();

        registry.register(
          NotificationChannelType.UI,
          new UINotificationChannel(repository),
        );

        registry.register(
          NotificationChannelType.Email,
          new EmailNotificationChannel(),
        );

        return registry;
      },
      inject: [UINotificationRepository],
    },
    {
      provide: NotificationTemplateRegistry,
      useFactory: () => {
        const registry = new NotificationTemplateRegistry();

        registry.register(
          NotificationType.LeaveBalanceReminder,
          new LeaveBalanceReminderNotificationTemplate(),
        );

        registry.register(
          NotificationType.MonthlyPayslip,
          new MonthlyPayslipNotificationTemplate(),
        );

        registry.register(
          NotificationType.HappyBirthday,
          new HappyBirthdayNotificationTemplate(),
        );

        return registry;
      },
    },
    UINotificationRepository,
    NotificationService,
    IdentityRemoteService,
  ],
})
export class NotificationModule {}
