import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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
    // Load the user from localStorage if it exists
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const setUser = (user: User) => {
    setUserState(user);
    localStorage.setItem('user', JSON.stringify(user)); // Persist user in localStorage
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  const refetchUser = useCallback(async () => {
    if (!user?.token || !user?.email) {
      console.error('No user token or email available for refetch');
      return;
    }

    try {
      // Use the profile endpoint to get updated user data
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const updatedUser = {
          email: result.Email,
          token: user.token,
          username: result.Username,
          id: user.id,
          isMember: result.IsMember
        };
        setUser(updatedUser);
        console.log('User data refetched successfully:', updatedUser);
      } else {
        console.error('Failed to refetch user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error refetching user data:', error);
    }
  }, [user?.token, user?.email]);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};
