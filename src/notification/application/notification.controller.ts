import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationType } from '../domain/types';
import { IsNotEmpty, IsEnum, IsString } from 'class-validator';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';

class SendNotificationRequestBody {
  @ApiProperty({
    description: 'Company ID of the notification recipient',
    example: 'company-123',
  })
  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @ApiProperty({
    description: 'User ID of the notification recipient',
    example: 'user-123',
  })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Type of notification to send',
    enum: NotificationType,
    example: NotificationType.LeaveBalanceReminder,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  notificationType!: NotificationType;
}

class SendNotificationResponse {
  @ApiProperty({
    description: 'Whether the notification was sent successfully',
    example: false,
  })
  sent!: boolean;

  @ApiProperty({
    description: 'Reason why notification was skipped, if applicable',
    example: 'user_not_found',
    required: false,
  })
  skipReason!: string | null;
}

class ListUiNotificationQuery {
  @ApiProperty({
    description: 'Company ID',
    example: 'company-123',
  })
  @IsNotEmpty()
  @IsString()
  companyId!: string;

  @ApiProperty({
    description: 'User ID',
    example: 'user-123',
  })
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
class UINotification {
  @ApiProperty({
    description: 'Unique identifier of the notification (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  id!: string;

  @ApiProperty({
    description: 'Company ID associated with the notification',
    example: 'company-123',
  })
  companyId!: string;

  @ApiProperty({
    description: 'User ID of the notification recipient',
    example: 'user-123',
  })
  userId!: string;

  @ApiProperty({
    description: 'Content of the notification',
    example: 'You have 10 days of leave remaining',
  })
  content!: string;
}

class ListUINotificationResponse {
  @ApiProperty({
    description: 'List of UI notifications',
    type: [UINotification],
  })
  notifications!: UINotification[];
}

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({
    summary: 'Send a notification to a user',
    description: 'Sends a notification of specified type to the target user',
  })
  @ApiBody({ type: SendNotificationRequestBody })
  @ApiResponse({
    status: 201,
    description: 'Notification sent successfully',
    type: SendNotificationResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request parameters',
  })
  async sendNotification(
    @Body() body: SendNotificationRequestBody,
  ): Promise<SendNotificationResponse> {
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

  @Get('list-ui-notifications')
  @ApiOperation({
    summary: 'List UI notifications for a user',
    description: 'Returns a list of UI notifications for the specified user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of UI notifications',
    type: [UINotification],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  async listUINotifications(
    @Query() query: ListUiNotificationQuery,
  ): Promise<ListUINotificationResponse> {
    const result = await this.notificationService.listUINotifications({
      companyId: query.companyId,
      userId: query.userId,
    });

    const notifications = result.map((notification) => {
      const plain = notification.toPlainObject();
      return {
        id: plain.id,
        companyId: plain.companyId,
        userId: plain.userId,
        content: plain.content,
      };
    });

    return {
      notifications,
    };
  }
}
