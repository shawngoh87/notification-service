import { Company } from './company.entity';
import { ChannelSubscription, NotificationChannelType } from '../types';

describe('Company', () => {
  const mockChannelSubscription: ChannelSubscription = {
    [NotificationChannelType.UI]: true,
    [NotificationChannelType.Email]: false,
  };

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
});
