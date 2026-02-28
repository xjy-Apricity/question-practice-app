import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuestions, getQuestionsVersion, setQuestions } from '../utils/storage';
import { SAMPLE_QUESTIONS, QUESTION_BANK_VERSION } from '../data/questions';
import { useAuth } from '../contexts/AuthContext';

export function Home() {
  const { user } = useAuth();

  useEffect(() => {
    const version = getQuestionsVersion();
    const questions = getQuestions();
    if (questions.length === 0 || version !== QUESTION_BANK_VERSION) {
      setQuestions(SAMPLE_QUESTIONS, QUESTION_BANK_VERSION);
    }
  }, []);

  const features = [
    {
      title: '随机刷题',
      desc: '从题库中随机抽取题目练习',
      path: '/practice',
      color: 'bg-blue-500',
    },
    {
      title: '错题本',
      desc: '查看和复习答错的题目',
      path: '/wrong',
      color: 'bg-amber-500',
    },
    {
      title: '模拟考试',
      desc: '50单选 + 40多选 + 10判断，共100道题',
      path: '/exam',
      color: 'bg-emerald-500',
    },
    {
      title: '成绩记录',
      desc: '查看历史模拟考试成绩',
      path: '/scores',
      color: 'bg-violet-500',
    },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">刷题助手</h1>
        <p className="text-slate-600">
          {user ? `欢迎回来，${user.username || user.email}` : '请先登录以记录成绩和错题'}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {features.map(f => (
          <Link
            key={f.path}
            to={f.path}
            className="block p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-100"
          >
            <div className={`w-12 h-12 rounded-lg ${f.color} mb-4 flex items-center justify-center text-white text-xl font-bold`}>
              {f.title[0]}
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">{f.title}</h2>
            <p className="text-slate-600 text-sm">{f.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
