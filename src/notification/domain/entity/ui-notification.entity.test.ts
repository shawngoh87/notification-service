import { UINotification } from './ui-notification.entity';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('UINotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a UI notification with a generated UUID', () => {
      const mockUuid = 'test-uuid-123';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);
      const content = 'Test notification content';

      const notification = UINotification.create({ content });

      expect(uuidv4).toHaveBeenCalledTimes(1);
      expect(notification).toBeInstanceOf(UINotification);
      expect(notification).toHaveProperty('id', mockUuid);
      expect(notification).toHaveProperty('content', content);
    });
  });

  describe('constructor', () => {
    it('should create a UI notification with provided id and content', () => {
      const id = 'test-id-123';
      const content = 'Test notification content';

      const notification = new UINotification({ id, content });

      expect(notification).toBeInstanceOf(UINotification);
      expect(notification).toHaveProperty('id', id);
      expect(notification).toHaveProperty('content', content);
    });
  });
});
