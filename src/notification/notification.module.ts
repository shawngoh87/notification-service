import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import {
  UI_NOTIFICATION_DOCUMENT,
  UINotificationSchema,
} from './infra/repository/ui-notification.document';
import { getDatabaseConnectionToken } from '../common/database.providers';
import { DatabaseModule } from '../common/database.module';
import { NotificationController } from './application/notification.controller';
import { NotificationService } from './application/notification.service';
import { IdentityModule } from '../identity/identity.module';
import { IdentityRemoteService } from './infra/remote-service/identity.remote-service';
import { ChannelRegistry } from './application/channel.registry';
import { TemplateRegistry } from './application/template.registry';
import { NotificationType, NotificationChannelType } from './domain/types';
import { LeaveBalanceReminderTemplate } from './domain/leave-balance-reminder-template';
import { UINotificationRepository } from './infra/repository/ui-notification.repository';
import { UINotificationChannel } from './application/channel/ui-notification-channel';

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: UI_NOTIFICATION_DOCUMENT,
      useFactory: (connection: Connection) => {
        return connection.model('ui_notification', UINotificationSchema);
      },
      inject: [getDatabaseConnectionToken()],
    },
    {
      provide: ChannelRegistry,
      useFactory: (repository: UINotificationRepository) => {
        const registry = new ChannelRegistry();
        registry.register(
          NotificationChannelType.UI,
          new UINotificationChannel(repository),
        );
        return registry;
      },
      inject: [UINotificationRepository],
    },
    {
      provide: TemplateRegistry,
      useFactory: () => {
        const registry = new TemplateRegistry();

        registry.register(
          NotificationType.LeaveBalanceReminder,
          new LeaveBalanceReminderTemplate(),
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
