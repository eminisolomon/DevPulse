import { db, signalMigrationComplete } from '@/db';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import React, { createContext, ReactNode, useContext } from 'react';
import { InitialLoader } from '../components/InitialLoader';
import migrations from '../drizzle/migrations';

interface DatabaseContextType {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({ isReady: false });

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    console.error('Migration error:', error);
  }

  if (!success) {
    return <InitialLoader />;
  }

  signalMigrationComplete();

  return (
    <DatabaseContext.Provider value={{ isReady: success }}>
      {children}
    </DatabaseContext.Provider>
  );
}
