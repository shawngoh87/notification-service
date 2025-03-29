import { Controller, Get, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { NOTIFICATION_MODEL } from './notification.model';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(NOTIFICATION_MODEL)
    private notificationModel: Model<Notification>,
  ) {}

  @Get('test')
  async test(): Promise<string> {
    await this.notificationModel.create({
      type: 'email',
      data: {
        subject: 'Test notification',
        body: 'This is a test notification',
      },
    });

    const notifications = await this.notificationModel.find().exec();
    console.log('Notifications:', notifications);

    return 'Hello test';
  }
}
