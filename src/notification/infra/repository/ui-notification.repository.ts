import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UI_NOTIFICATION_DOCUMENT } from './ui-notification.document';
import { UINotificationDocument } from './ui-notification.document';
import { UINotification } from '../../domain/entity/ui-notification.entity';
import { ObjectId } from 'bson';

@Injectable()
export class UINotificationRepository {
  constructor(
    @Inject(UI_NOTIFICATION_DOCUMENT)
    private readonly uiNotificationModel: Model<UINotificationDocument>,
  ) {}

  toDomain(document: UINotificationDocument): UINotification {
    return new UINotification({
      id: document._id.toHexString(),
      content: document.content,
      companyId: document.companyId,
      userId: document.userId,
    });
  }

  async create(notification: UINotification): Promise<UINotification> {
    const data = notification.toPlainObject();

    await this.uiNotificationModel.create({
      _id: new ObjectId(data.id),
      content: data.content,
      companyId: data.companyId,
      userId: data.userId,
    });

    return notification;
  }

  async listByUserId(params: {
    companyId: string;
    userId: string;
  }): Promise<UINotification[]> {
    const notifications = await this.uiNotificationModel.find({
      companyId: params.companyId,
      userId: params.userId,
    });

    // TODO: Use generator
    return notifications.map((notification) => this.toDomain(notification));
  }
}
