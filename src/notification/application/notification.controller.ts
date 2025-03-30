import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationType } from '../domain/types';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import { UINotification } from '../domain/entity/ui-notification.entity';

class SendNotificationRequestBody {
  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsEnum(NotificationType)
  notificationType!: NotificationType;
}

class ListUiNotificationQuery {
  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;
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

  @Get('list-ui-notification')
  async listUiNotification(
    @Query() query: ListUiNotificationQuery,
  ): Promise<UINotification[]> {
    const result = await this.notificationService.listUiNotifications({
      companyId: query.companyId,
      userId: query.userId,
    });

    return result;
  }
}
