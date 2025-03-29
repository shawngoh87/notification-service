import * as mongoose from 'mongoose';

export const getDatabaseConnectionToken = () => 'DATABASE_CONNECTION';

export const databaseProviders = [
  {
    provide: getDatabaseConnectionToken(),
    useFactory: (): Promise<typeof mongoose> => {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('MONGODB_URI is not defined');
      }

      return mongoose.connect(uri);
    },
  },
];
