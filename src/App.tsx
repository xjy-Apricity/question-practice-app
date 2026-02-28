import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Practice } from './pages/Practice';
import { WrongBook } from './pages/WrongBook';
import { Exam } from './pages/Exam';
import { ExamResult } from './pages/ExamResult';
import { Scores } from './pages/Scores';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/wrong" element={<WrongBook />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/exam/result" element={<ExamResult />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
