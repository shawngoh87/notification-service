import { Injectable } from '@nestjs/common';
import { UINotificationRepository } from '../../infra/repository/ui-notification.repository';
import { UINotification } from '../../domain/entity/ui-notification.entity';
import { NotificationChannel } from './notification-channel.interface';

type UINotificationDTO = {
  companyId: string;
  userId: string;
  content: string;
};

@Injectable()
export class UINotificationChannel
  implements NotificationChannel<UINotificationDTO>
{
  constructor(
    private readonly uiNotificationRepository: UINotificationRepository,
  ) {}

  async send(data: UINotificationDTO) {
    const notification = UINotification.create({
      companyId: data.companyId,
      userId: data.userId,
      content: data.content,
    });

    await this.uiNotificationRepository.create(notification);
  }
}
