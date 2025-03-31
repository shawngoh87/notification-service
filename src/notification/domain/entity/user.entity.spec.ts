import { User } from './user.entity';
import { Company } from './company.entity';
import { NotificationChannelType } from '../types';

describe('User', () => {
  describe('create', () => {
    it('should create a user instance with company', () => {
      const user = User.create({
        id: '1',
        name: 'Test User',
        company: {
          id: '1',
          name: 'Test Company',
          channelSubscription: {
            [NotificationChannelType.UI]: true,
            [NotificationChannelType.Email]: true,
          },
        },
        channelSubscription: {
          [NotificationChannelType.UI]: true,
          [NotificationChannelType.Email]: true,
        },
      });

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('1');
      expect(user.name).toBe('Test User');
      expect(user.company).toBeInstanceOf(Company);
      expect(user.company.id).toBe('1');
      expect(user.company.name).toBe('Test Company');
      expect(user.channelSubscription).toEqual({
        [NotificationChannelType.UI]: true,
        [NotificationChannelType.Email]: true,
      });
      expect(user.company.channelSubscription).toEqual({
        [NotificationChannelType.UI]: true,
        [NotificationChannelType.Email]: true,
      });
    });
  });

  describe('isSubscribedToChannel', () => {
    it('should return true when both user and company are subscribed to the channel', () => {
      const user = User.create({
        id: '1',
        name: 'Test User',
        company: {
          id: '1',
          name: 'Test Company',
          channelSubscription: {
            [NotificationChannelType.UI]: true,
            [NotificationChannelType.Email]: true,
          },
        },
        channelSubscription: {
          [NotificationChannelType.UI]: true,
          [NotificationChannelType.Email]: true,
        },
      });

      expect(user.isSubscribedToChannel(NotificationChannelType.UI)).toBe(true);
      expect(user.isSubscribedToChannel(NotificationChannelType.Email)).toBe(
        true,
      );
    });

    it('should return false when either user or company is not subscribed to the channel', () => {
      const user = User.create({
        id: '1',
        name: 'Test User',
        company: {
          id: '1',
          name: 'Test Company',
          channelSubscription: {
            [NotificationChannelType.UI]: false,
            [NotificationChannelType.Email]: true,
          },
        },
        channelSubscription: {
          [NotificationChannelType.UI]: true,
          [NotificationChannelType.Email]: false,
        },
      });

      expect(user.isSubscribedToChannel(NotificationChannelType.UI)).toBe(
        false,
      );
      expect(user.isSubscribedToChannel(NotificationChannelType.Email)).toBe(
        false,
      );
    });
  });
});
