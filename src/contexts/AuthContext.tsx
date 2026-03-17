import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TokenManager } from '../lib/auth';

export interface User {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, tokens: { accessToken: string; refreshToken?: string }, rememberMe?: boolean) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始化时检查登录状态
    const savedUser = TokenManager.getUser();
    const token = TokenManager.getAccessToken();
    
    if (savedUser && token) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, tokens: { accessToken: string; refreshToken?: string }, rememberMe?: boolean) => {
    TokenManager.save(tokens, rememberMe);
    TokenManager.saveUser(userData, rememberMe);
    setUser(userData);
  };

  const logout = () => {
    TokenManager.clear();
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      TokenManager.saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}