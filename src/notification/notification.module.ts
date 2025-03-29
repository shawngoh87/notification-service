import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { NotificationSchema } from './infra/notification.model';
import { getDatabaseConnectionToken } from '../common/database.providers';
import { DatabaseModule } from '../common/database.module';
import { NotificationController } from './application/notification.controller';
import { NotificationService } from './application/notification.service';
import { IdentityModule } from '../identity/identity.module';
import { IdentityRemoteService } from './infra/remote-service/identity.remote-service';

@Module({
  imports: [DatabaseModule, IdentityModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: 'NOTIFICATION_MODEL',
      useFactory: (connection: Connection) => {
        return connection.model('Notification', NotificationSchema);
      },
      inject: [getDatabaseConnectionToken()],
    },
    NotificationService,
    IdentityRemoteService,
  ],
})
export class NotificationModule {}
