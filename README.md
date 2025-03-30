## Notification Service

This service owns all aspects of notification, including the template content, storage, and delivery.

Service callers can send the predefined notification types by calling `/api/notification/send` and list all UI notifications by calling `/api/notification/list-ui-notifications`.

Types of notification:

1. Remind a user of their leave balance
2. Notify a user that the monthly payslip is ready
3. Wish a user happy birthday

## Important resources

Swagger docs available under `http://host:port/docs` and at the [root](swagger.json) of the repository. Drop `swagger.json` into Postman to import the collection.

Guides on adding new channels and new notification types [here](#guides).

Fake company/user data is defined [here](src/identity/identity.service.ts).

## Setup

Prerequisites:

1. Docker
2. `nvm`
3. `node` v22
4. `npm` v10

Install dependencies

```bash
nvm use
npm install
```

Setup environment

```bash
cp .env.example .env
cp .env.test.example .env.test
```

## Development setup

```bash
npm run docker:dev:up   # Start MongoDB
npm run dev             # Start the server
npm run test:watch      # Run tests in watch mode
```

## Running tests

```bash
npm run test            # Unit tests
npm run test:e2e        # E2E tests
```

## Production

```bash
docker compose up -d
```

## Guides

### Adding a new channel

Step 1: Add your new channel type in `NotificationChannelType` [here](src/notification/domain/types.ts)

```ts
export const NotificationChannelType = {
  // ...other types
  MyNewChannelType: 'new-type',
} as const;
```

Step 2: Build your channel class that implements the `NotificationChannel` [interface](src/notification/application/notification-channel/notification-channel.interface.ts)

```ts
export class MyNewChannel implements NotificationChannel {
  async send(params: { companyId: string; userId: string; data: YourDTO }) {
    // Do something
  }
}
```

Step 3: Register your channel in `NotificationModule` under `NotificationChannelRegistry` [here](src/notification/notification.module.ts)

```ts

@Module({
  providers: [
    // ...other providers
    {
      provide: NotificationChannelRegistry,
      useFactory: (dependency: Dependency) => {
      const registry = new NotificationChannelRegistry();

      // ...other channels

      // Declare and inject your dependencies here
      registry.register(MyNewChannel.Email, new MyNewChannel(dependency));

      return registry;
      },
      inject: [Dependency],
    },
  ];
})
```

### Adding a new template

Step 1: Add your new template type in `NotificationType` [here](src/notification/domain/types.ts)

```ts
export const NotificationType = {
  // ...other types
  MyNewNotificationType: 'new-type',
} as const;
```

Step 2: Build your template class that implements the `NotificationTemplate` [interface](src/notification/application/notification-template/notification-template.interface.ts)

```ts
export class MyNewNotificationTemplate implements NotificationTemplate {
  getSupportedChannels(): NotificationChannelType[] {
    return [
      // List of all the channel types you want to support
    ];
  }

  getContent(channel: NotificationChannelType, params: Record<string, any>) {
    switch (channel) {
      case NotificationChannelType.UI:
        // Return the payload required for the channel to work
        return {
          content: 'some content',
        };
      default:
        throw new Error('unsupported');
    }
  }
}
```

Step 3: Register your template in `NotificationModule` under `NotificationTemplateRegistry` [here](src/notification/notification.module.ts)

```ts
@Module({
  providers: [
    // ...other providers
    {
      provide: NotificationTemplateRegistry,
      useFactory: () => {
        const registry = new NotificationTemplateRegistry();

        // ...other templates

        registry.register(
          NotificationType.MyNew,
          new HappyBirthdayNotificationTemplate(),
        );

        return registry;
      },
    }
  ];
})
```

## Author

Shawn
<<shawngoh87@gmail.com>>

## Improvements

- Add authentication instead of relying on companyId/userId for `/list-ui-notifications`
- Add pagination for `/list-ui-notifications`
- Persist all notifications for idempotency
- Add more exceptions and improve exception handling
