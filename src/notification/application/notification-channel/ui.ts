import { Injectable } from '@nestjs/common';
import { UINotificationRepository } from '../../infra/repository/ui-notification.repository';
import { UINotification } from '../../domain/entity/ui-notification.entity';
import { NotificationChannel } from './notification-channel.interface';

type UINotificationDTO = {
  content: string;
};

@Injectable()
export class UINotificationChannel implements NotificationChannel {
  constructor(
    private readonly uiNotificationRepository: UINotificationRepository,
  ) {}

  async send(params: {
    companyId: string;
    userId: string;
    data: UINotificationDTO;
  }) {
    const notification = UINotification.create({
      companyId: params.companyId,
      userId: params.userId,
      content: params.data.content,
    });

    await this.uiNotificationRepository.create(notification);
  }
}
