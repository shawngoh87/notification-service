import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UI_NOTIFICATION_DOCUMENT } from './ui-notification.document';
import { UINotificationDocument } from './ui-notification.document';
import { UINotification } from '../../domain/entity/ui-notification.entity';

@Injectable()
export class UINotificationRepository {
  constructor(
    @Inject(UI_NOTIFICATION_DOCUMENT)
    private readonly uiNotificationModel: Model<UINotificationDocument>,
  ) {}

  async create(notification: UINotification): Promise<UINotification> {
    const data = notification.toPlainObject();

    await this.uiNotificationModel.create({
      id: data.id,
      content: data.content,
    });

    return notification;
  }

  async findByUserId(params: {
    companyId: string;
    userId: string;
  }): Promise<UINotification[]> {
    return Promise.resolve([]);
  }
}
