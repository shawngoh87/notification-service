import { User } from './user.entity';
import { Company } from './company.entity';
import { ChannelSubscription, NotificationChannelType } from './types';

describe('User', () => {
  const mockChannelSubscription: ChannelSubscription = {
    [NotificationChannelType.UI]: true,
    [NotificationChannelType.Email]: false,
  };

  const mockCompany = Company.create({
    id: '1',
    name: 'Test Company',
    channelSubscription: {
      [NotificationChannelType.UI]: true,
      [NotificationChannelType.Email]: true,
    },
  });

  it('should construct a user', () => {
    const user = new User(
      '1',
      'Test User',
      mockCompany,
      mockChannelSubscription,
    );

    expect(user.id).toBe('1');
    expect(user.name).toBe('Test User');
    expect(user.company).toBe(mockCompany);
    expect(user.channelSubscription).toEqual(mockChannelSubscription);
  });

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
        channelSubscription: mockChannelSubscription,
      });

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe('1');
      expect(user.name).toBe('Test User');
      expect(user.company).toBeInstanceOf(Company);
      expect(user.company.id).toBe('1');
      expect(user.company.name).toBe('Test Company');
      expect(user.channelSubscription).toEqual(mockChannelSubscription);
    });
  });

  describe('isSubscribedToChannel', () => {
    it('should return true when user is subscribed to the channel', () => {
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
        channelSubscription: mockChannelSubscription,
      });

      expect(user.isSubscribedToChannel(NotificationChannelType.UI)).toBe(true);
    });

    it('should return false when user is not subscribed to the channel', () => {
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
        channelSubscription: mockChannelSubscription,
      });

      expect(user.isSubscribedToChannel(NotificationChannelType.Email)).toBe(
        false,
      );
    });
  });
});
