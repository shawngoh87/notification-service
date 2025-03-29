import { Notification } from './notification.entity';
import { NotificationChannelType, NotificationType } from './types';

describe('Notification', () => {
  it('should construct a notification', () => {
    const notification = new Notification({
      id: '1',
      type: NotificationType.LeaveBalanceReminder,
      data: {
        some: 'data',
        another: 'data',
      },
    });

    expect(notification.id).toBe('1');
    expect(notification.type).toBe(NotificationType.LeaveBalanceReminder);
    expect(notification.data).toEqual({
      some: 'data',
      another: 'data',
    });
  });

  describe('getChannels', () => {
    it('should get channels for a leave balance reminder notification', () => {
      const notification = new Notification({
        id: '1',
        type: NotificationType.LeaveBalanceReminder,
        data: {},
      });

      expect(notification.getChannels()).toEqual([NotificationChannelType.UI]);
    });

    it('should get channels for a monthly payslip notification', () => {
      const notification = new Notification({
        id: '1',
        type: NotificationType.MonthlyPayslip,
        data: {},
      });

      expect(notification.getChannels()).toEqual([
        NotificationChannelType.Email,
      ]);
    });

    it('should get channels for a happy birthday notification', () => {
      const notification = new Notification({
        id: '1',
        type: NotificationType.HappyBirthday,
        data: {},
      });

      expect(notification.getChannels()).toEqual([
        NotificationChannelType.UI,
        NotificationChannelType.Email,
      ]);
    });

    it('should throw an error if the notification type is unsupported', () => {
      const notification = new Notification({
        id: '1',
        // @ts-expect-error
        type: 'unsupported',
        data: {},
      });

      expect(() => notification.getChannels()).toThrow(
        Notification.UnsupportedNotificationTypeException,
      );
    });
  });
});
