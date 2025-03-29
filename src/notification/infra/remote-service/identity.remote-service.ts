import { Injectable } from '@nestjs/common';
import { IdentityService } from '../../../identity/identity.service';
import { User } from '../../domain/user.entity';

class UnknownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownError';
  }
}

@Injectable()
export class IdentityRemoteService {
  static UnknownError = UnknownError;

  constructor(private readonly identityService: IdentityService) {}

  async getUser(params: {
    userId: string;
    companyId: string;
  }): Promise<User | null> {
    try {
      // Fake remote service - should be replaced with a http call
      const userFromIdentityService =
        await this.identityService.getUser(params);

      if (!userFromIdentityService) {
        return null;
      }

      return User.create({
        id: userFromIdentityService.id,
        name: userFromIdentityService.name,
        company: {
          id: userFromIdentityService.company.id,
          name: userFromIdentityService.company.name,
          channelSubscription:
            userFromIdentityService.company.channelSubscription,
        },
        channelSubscription: userFromIdentityService.channelSubscription,
      });
    } catch {
      throw new UnknownError('Failed to get user from identity service');
    }
  }
}
