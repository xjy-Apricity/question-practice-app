import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessContextType {
  hasAccess: boolean;
  verifyPassword: (password: string) => boolean;
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

const CORRECT_PASSWORD = 'sanjililun2025'; // 访问密码

export function AccessProvider({ children }: { children: ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // 检查 sessionStorage 中是否已验证
    const verified = sessionStorage.getItem('access_verified');
    if (verified === 'true') {
      setHasAccess(true);
    }
  }, []);

  const verifyPassword = (password: string) => {
    if (password === CORRECT_PASSWORD) {
      setHasAccess(true);
      sessionStorage.setItem('access_verified', 'true');
      return true;
    }
    return false;
  };

  return (
    <AccessContext.Provider value={{ hasAccess, verifyPassword }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  const context = useContext(AccessContext);
  if (!context) {
    throw new Error('useAccess must be used within AccessProvider');
  }
  return context;
}
