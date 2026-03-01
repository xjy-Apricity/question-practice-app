import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuestions, getWrongRecords, removeWrongRecord } from '../utils/storage';
import { QuestionCard } from '../components/QuestionCard';
import { useAuth } from '../contexts/AuthContext';
import type { Question } from '../types';

export function WrongBook() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRemove, setShowRemove] = useState(false);

  useEffect(() => {
    if (!user) return;
    const records = getWrongRecords(user.id);
    const ids = records.map(r => r.questionId);
    const all = getQuestions();
    setQuestions(all.filter(q => ids.includes(q.id)));
  }, [user]);

  const handleRemove = (questionId: string) => {
    if (!user) return;
    removeWrongRecord(user.id, questionId);
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setCurrentIndex(i => (i >= questions.length - 1 ? Math.max(0, i - 1) : i));
    setShowRemove(false);
  };

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 mb-4">请先登录以查看错题本</p>
        <Link to="/login" className="text-blue-600 hover:underline">去登录</Link>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">错题本</h1>
        <p className="text-slate-600 mb-4">暂无错题，去刷题吧！</p>
        <Link to="/practice" className="text-blue-600 hover:underline">随机刷题</Link>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">错题本</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/wrong-practice"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            开始刷题
          </Link>
          <span className="text-slate-600">
            共 {questions.length} 题，第 {currentIndex + 1} 题
          </span>
        </div>
      </div>

      <QuestionCard question={current} userAnswer="" disabled showResult={false} />

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <p className="text-sm font-medium text-slate-700 mb-1">解析</p>
        <p className="text-slate-600">{current.explanation}</p>
        <p className="text-sm text-slate-500 mt-2">正确答案：{current.correctAnswer}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setCurrentIndex(i => (i > 0 ? i - 1 : questions.length - 1))}
          className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
        >
          上一题
        </button>
        <button
          onClick={() => setCurrentIndex(i => (i < questions.length - 1 ? i + 1 : 0))}
          className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
        >
          下一题
        </button>
        {showRemove ? (
          <>
            <button
              onClick={() => handleRemove(current.id)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              确认移除
            </button>
            <button
              onClick={() => setShowRemove(false)}
              className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg"
            >
              取消
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowRemove(true)}
            className="px-6 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
          >
            从错题本移除
          </button>
        )}
      </div>
    </div>
  );
}
