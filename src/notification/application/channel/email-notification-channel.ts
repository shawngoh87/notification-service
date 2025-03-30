import { Injectable } from '@nestjs/common';
import { UINotificationRepository } from '../../infra/repository/ui-notification.repository';
import { NotificationChannel } from './notification-channel.interface';

type EmailNotificationDTO = {
  subject: string;
  content: string;
};

@Injectable()
export class EmailNotificationChannel
  implements NotificationChannel<EmailNotificationDTO>
{
  constructor(
    private readonly uiNotificationRepository: UINotificationRepository,
  ) {}

  async send(data: EmailNotificationDTO) {
    console.log('Subject', data.subject);
    console.log('Content', data.content);
    await Promise.resolve();
  }
}
