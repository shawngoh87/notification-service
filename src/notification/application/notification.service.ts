import { Injectable } from '@nestjs/common';
import { Notification } from '../domain/notification.entity';
import { NotificationType } from '../domain/types';

@Injectable()
export class NotificationService {
  constructor() {}

  async sendNotification(params: {
    companyId: string;
    userId: string;
    notificationType: NotificationType;
  }): Promise<Notification> {
    console.log(params);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return new Notification({
      id: '123',
      type: NotificationType.LeaveBalanceReminder,
      data: {
        subject: 'Test notification',
        content: 'This is a test notification',
      },
    });
  }
}
