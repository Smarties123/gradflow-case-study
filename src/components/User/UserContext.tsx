import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { dummyUser } from '../../data/dummyData';

// Define the shape of your user data
interface User {
  email: string
  username: string;
  token: string;
  id: number;
  isMember: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  refetchUser: () => Promise<void>;
  showWelcomeToPremium: boolean;
  setShowWelcomeToPremium: (show: boolean) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook for accessing the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Context provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(() => {
    // In demo mode, always use dummy user
    return dummyUser;
  });

  const [showWelcomeToPremium, setShowWelcomeToPremium] = useState(false);

  const setUser = (user: User) => {
    setUserState(user);
    // Don't persist in localStorage for demo mode
  };

  const clearUser = () => {
    setUserState(null);
    // Don't clear from localStorage in demo mode
  };

  const refetchUser = useCallback(async () => {
    // In demo mode, just return the dummy user
    if (user) {
      setUser(dummyUser);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, refetchUser, showWelcomeToPremium, setShowWelcomeToPremium }}>
      {children}
    </UserContext.Provider>
  );
};
