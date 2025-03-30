import { UINotification } from './ui-notification.entity';

describe('UINotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a UI notification with a generated UUID', () => {
      const mockUuid = 'test-uuid-123';
      const content = 'Test notification content';
      const companyId = 'test-company-id-123';
      const userId = 'test-user-id-123';

      const notification = UINotification.create({
        content,
        companyId,
        userId,
      });

      expect(notification).toBeInstanceOf(UINotification);
      expect(notification).toHaveProperty('id', mockUuid);
      expect(notification).toHaveProperty('content', content);
    });
  });

  describe('constructor', () => {
    it('should create a UI notification with provided id and content', () => {
      const id = 'test-id-123';
      const content = 'Test notification content';
      const companyId = 'test-company-id-123';
      const userId = 'test-user-id-123';

      const notification = new UINotification({
        id,
        content,
        companyId,
        userId,
      });
      expect(notification).toBeInstanceOf(UINotification);
      expect(notification).toHaveProperty('id', id);
      expect(notification).toHaveProperty('content', content);
    });
  });
});
