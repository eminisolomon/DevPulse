import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import React, { createContext, ReactNode, useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import migrations from '../drizzle/migrations';
import { db } from './index';

interface DatabaseContextType {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({ isReady: false });

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    console.error('Migration error:', error);
    // You might want to show a more user-friendly error screen here
  }

  if (!success) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ isReady: success }}>
      {children}
    </DatabaseContext.Provider>
  );
}
