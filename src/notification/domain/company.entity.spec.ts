import { Company } from './company.entity';
import { ChannelSubscription, NotificationChannelType } from './types';

describe('Company', () => {
  const mockChannelSubscription: ChannelSubscription = {
    [NotificationChannelType.UI]: true,
    [NotificationChannelType.Email]: false,
  };

  it('should construct a company', () => {
    const company = new Company('1', 'Test Company', mockChannelSubscription);

    expect(company.id).toBe('1');
    expect(company.name).toBe('Test Company');
    expect(company.channelSubscription).toEqual(mockChannelSubscription);
  });

  describe('create', () => {
    it('should create a company instance', () => {
      const company = Company.create({
        id: '1',
        name: 'Test Company',
        channelSubscription: mockChannelSubscription,
      });

      expect(company).toBeInstanceOf(Company);
      expect(company.id).toBe('1');
      expect(company.name).toBe('Test Company');
      expect(company.channelSubscription).toEqual(mockChannelSubscription);
    });
  });

  describe('isSubscribedToChannel', () => {
    it('should return true when company is subscribed to the channel', () => {
      const company = Company.create({
        id: '1',
        name: 'Test Company',
        channelSubscription: mockChannelSubscription,
      });

      expect(company.isSubscribedToChannel(NotificationChannelType.UI)).toBe(
        true,
      );
    });

    it('should return false when company is not subscribed to the channel', () => {
      const company = Company.create({
        id: '1',
        name: 'Test Company',
        channelSubscription: mockChannelSubscription,
      });

      expect(company.isSubscribedToChannel(NotificationChannelType.Email)).toBe(
        false,
      );
    });
  });
});
