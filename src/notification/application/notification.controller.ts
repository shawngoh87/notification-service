import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationType } from '../domain/types';
import { IsNotEmpty, IsEnum } from 'class-validator';

class SendNotificationRequestBody {
  @IsNotEmpty()
  companyId!: string;

  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  notificationType!: NotificationType;
}

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() body: SendNotificationRequestBody) {
    const result = await this.notificationService.sendNotification({
      companyId: body.companyId,
      userId: body.userId,
      notificationType: body.notificationType,
    });

    return {
      sent: result.sent,
      skipReason: result.skipReason,
    };
  }
}
