import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

export const DATABASE_NAME = 'devpulse.db';

const expoDb = openDatabaseSync(DATABASE_NAME);

export const db = drizzle(expoDb, { schema });

let resolveMigration: () => void;
export const migrationPromise = new Promise<void>((resolve) => {
  resolveMigration = resolve;
});

export const signalMigrationComplete = () => {
  if (resolveMigration) {
    resolveMigration();
  }
};

export { schema };
