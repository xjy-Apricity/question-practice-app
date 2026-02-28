import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { getCurrentUser, setCurrentUser as saveUser } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, username?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const login = async (email: string, password: string) => {
    const usersRaw = localStorage.getItem('qp_users');
    const users: Array<{ id: string; email: string; password: string; username?: string }> = usersRaw
      ? JSON.parse(usersRaw)
      : [];
    const found = users.find(u => u.email === email);
    if (!found || found.password !== password) {
      return { success: false, error: '邮箱或密码错误' };
    }
    const u: User = { id: found.id, email: found.email, username: found.username };
    setUser(u);
    saveUser(u);
    return { success: true };
  };

  const register = async (email: string, password: string, username?: string) => {
    const usersRaw = localStorage.getItem('qp_users');
    const users: Array<{ id: string; email: string; password: string; username?: string }> = usersRaw
      ? JSON.parse(usersRaw)
      : [];
    if (users.some(u => u.email === email)) {
      return { success: false, error: '该邮箱已被注册' };
    }
    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    users.push({ id, email, password, username });
    localStorage.setItem('qp_users', JSON.stringify(users));
    const u: User = { id, email, username };
    setUser(u);
    saveUser(u);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    saveUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
