import { Injectable } from '@nestjs/common';
import { NotificationChannel } from './notification-channel.interface';

type EmailNotificationDTO = {
  subject: string;
  content: string;
};

@Injectable()
export class EmailNotificationChannel
  implements NotificationChannel<EmailNotificationDTO>
{
  async send(data: EmailNotificationDTO) {
    console.log('Subject', data.subject);
    console.log('Content', data.content);
    await Promise.resolve();
  }
}
