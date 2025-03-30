import { Injectable } from '@nestjs/common';
import { NotificationChannel } from './notification-channel.interface';

type EmailNotificationDTO = {
  subject: string;
  content: string;
};

@Injectable()
export class EmailNotificationChannel implements NotificationChannel {
  async send(params: {
    companyId: string;
    userId: string;
    data: EmailNotificationDTO;
  }) {
    console.log('Subject', params.data.subject);
    console.log('Content', params.data.content);
    await Promise.resolve();
  }
}
