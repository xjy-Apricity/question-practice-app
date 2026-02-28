import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-slate-800 hover:text-slate-600">
            刷题助手
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`text-sm ${location.pathname === '/' ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
            >
              首页
            </Link>
            <Link
              to="/practice"
              className={`text-sm ${location.pathname.startsWith('/practice') ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
            >
              随机刷题
            </Link>
            <Link
              to="/wrong"
              className={`text-sm ${location.pathname.startsWith('/wrong') ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
            >
              错题本
            </Link>
            <Link
              to="/exam"
              className={`text-sm ${location.pathname.startsWith('/exam') ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
            >
              模拟考试
            </Link>
            <Link
              to="/scores"
              className={`text-sm ${location.pathname.startsWith('/scores') ? 'text-blue-600 font-medium' : 'text-slate-600 hover:text-slate-900'}`}
            >
              成绩记录
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  退出
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-700">
                登录
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">{children}</main>
      <footer className="text-center py-4 text-xs text-slate-500">
        由xjy开发，疑问请联系18382125920
      </footer>
    </div>
  );
}
