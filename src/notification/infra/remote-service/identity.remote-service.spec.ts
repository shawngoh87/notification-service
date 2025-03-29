import { Test, TestingModule } from '@nestjs/testing';
import { IdentityModule } from '../../../identity/identity.module';
import { IdentityRemoteService } from './identity.remote-service';
import { IdentityService } from '../../../identity/identity.service';

describe('IdentityRemoteService', () => {
  let remoteService: IdentityRemoteService;
  let mockIdentityService: jest.Mocked<Partial<IdentityService>>;

  beforeEach(async () => {
    mockIdentityService = {
      getUser: jest.fn().mockResolvedValue({
        id: '1',
        name: 'John Doe',
        company: {
          id: '1',
          name: 'Acme Corp',
          channelSubscription: {
            email: true,
            ui: true,
          },
        },
        channelSubscription: {
          email: true,
          ui: true,
        },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [IdentityModule],
      providers: [IdentityRemoteService],
    })
      .overrideProvider(IdentityService)
      .useValue(mockIdentityService)
      .compile();

    remoteService = module.get<IdentityRemoteService>(IdentityRemoteService);
  });

  describe('getUser', () => {
    it('should return user and company details', async () => {
      const result = await remoteService.getUser({
        userId: '1',
        companyId: '1',
      });

      expect(mockIdentityService.getUser).toHaveBeenCalledWith({
        userId: '1',
        companyId: '1',
      });
      expect(result).toMatchObject({
        id: '1',
        name: 'John Doe',
        company: {
          id: '1',
          name: 'Acme Corp',
          channelSubscription: {
            email: true,
            ui: true,
          },
        },
        channelSubscription: {
          email: true,
          ui: true,
        },
      });
    });

    it('should return null if user is not found', async () => {
      (mockIdentityService.getUser as jest.Mock).mockResolvedValue(null);

      const result = await remoteService.getUser({
        userId: '1',
        companyId: '1',
      });

      expect(mockIdentityService.getUser).toHaveBeenCalledWith({
        userId: '1',
        companyId: '1',
      });
      expect(result).toBeNull();
    });
  });
});
