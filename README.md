## Notification Service

This service owns all aspects of notification, including the template content, storage, and delivery.

Service callers can send the predefined notification types by calling `/api/notification/send` and list all UI notifications by calling `/api/notification/list-ui-notifications`. API docs (TODO) [here](WIP).

Types of notification:

1. Remind a user of their leave balance
2. Notify a user that the monthly payslip is ready
3. Wish a user happy birthday

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

TODO

## Guides

### Adding a new channel

TODO

### Adding a new template

TODO

## Author

Shawn
<<shawngoh87@gmail.com>>

## Improvements

TODO
