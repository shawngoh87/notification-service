import { Module } from '@nestjs/common';
import { Connection } from 'mongoose';
import { NotificationSchema } from './notification.model';
import { getDatabaseConnectionToken } from '../common/database.providers';
import { DatabaseModule } from '../common/database.module';
import { NotificationController } from './notification.controller';
@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: 'NOTIFICATION_MODEL',
      useFactory: (connection: Connection) => {
        return connection.model('Notification', NotificationSchema);
      },
      inject: [getDatabaseConnectionToken()],
    },
  ],
})
export class NotificationModule {}
