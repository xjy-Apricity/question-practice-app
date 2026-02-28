import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExamRecords } from '../utils/storage';
import { getQuestions } from '../utils/storage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import type { ExamRecord } from '../types';

export function Scores() {
  const { user } = useAuth();
  const [records, setRecords] = useState<ExamRecord[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Record<string, { title: string; correctAnswer: string; explanation: string }>>({});

  useEffect(() => {
    if (!user) return;
    setRecords(getExamRecords(user.id));
    const qs = getQuestions();
    const map: Record<string, { title: string; correctAnswer: string; explanation: string }> = {};
    qs.forEach(q => {
      map[q.id] = { title: q.title, correctAnswer: q.correctAnswer, explanation: q.explanation };
    });
    setQuestions(map);
  }, [user]);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">成绩记录</h1>

        {records.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-slate-600 mb-4">暂无考试记录</p>
            <Link to="/exam" className="text-blue-600 hover:underline">去模拟考试</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map(r => (
              <div
                key={r.id}
                className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-50"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-2xl font-bold ${r.score >= 60 ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {r.score} 分
                    </span>
                    <span className="text-slate-600">
                      {r.correctCount} / {r.totalQuestions} 题
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {new Date(r.endTime).toLocaleString('zh-CN')}
                  </span>
                  <span className="text-slate-400">
                    {expandedId === r.id ? '收起' : '展开详情'}
                  </span>
                </button>

                {expandedId === r.id && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50">
                    {r.answers.slice(0, 10).map((a, i) => {
                      const q = questions[a.questionId];
                      return (
                        <div key={i} className="mb-4 last:mb-0">
                          <p className="text-slate-800 font-medium text-sm mb-1">
                            {i + 1}. {q?.title || a.questionId}
                          </p>
                          <p className="text-xs text-slate-600">
                            你的答案：{a.userAnswer || '未作答'}
                            {!a.correct && q && (
                              <span className="text-red-600">（正确答案：{q.correctAnswer}）</span>
                            )}
                          </p>
                          {q && (
                            <p className="text-xs text-slate-500 mt-1">解析：{q.explanation}</p>
                          )}
                        </div>
                      );
                    })}
                    {r.answers.length > 10 && (
                      <p className="text-xs text-slate-500">仅展示前 10 题</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
