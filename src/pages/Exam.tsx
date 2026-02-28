import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions } from '../utils/storage';
import { getExamQuestions, checkAnswer } from '../utils/questions';
import { addExamRecord, addWrongRecord } from '../utils/storage';
import { QuestionCard } from '../components/QuestionCard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import type { Question } from '../types';

const EXAM_DURATION_MINUTES = 120; // 2小时

export function Exam() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'running' | 'loading'>('idle');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60); // 秒
  const [error, setError] = useState('');
  const answersRef = useRef<Record<string, string>>({});
  const questionsRef = useRef<Question[]>([]);
  answersRef.current = answers;
  questionsRef.current = questions;

  const startExam = () => {
    try {
      const all = getQuestions();
      const qs = getExamQuestions(all);
      setQuestions(qs);
      setAnswers({});
      setCurrentIndex(0);
      setTimeLeft(EXAM_DURATION_MINUTES * 60);
      setStatus('running');
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    if (status !== 'running') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          doSubmit(questionsRef.current, answersRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  const doSubmit = (qs: Question[], ans: Record<string, string>) => {
    if (!user || qs.length === 0) return;

    const answerList = qs.map(q => {
      const ua = ans[q.id] || '';
      const correct = checkAnswer(q, ua);
      if (!correct && ua) {
        addWrongRecord(user.id, q.id, ua);
      }
      return { questionId: q.id, userAnswer: ua, correct };
    });

    const correctCount = answerList.filter(a => a.correct).length;
    const score = Math.round((correctCount / qs.length) * 100);

    addExamRecord({
      id: `exam_${Date.now()}`,
      userId: user.id,
      startTime: new Date(Date.now() - (EXAM_DURATION_MINUTES * 60 - timeLeft) * 1000).toISOString(),
      endTime: new Date().toISOString(),
      totalQuestions: qs.length,
      correctCount,
      score,
      answers: answerList,
    });

    navigate('/exam/result', {
      state: { score, correctCount, total: qs.length, answers: answerList, questions: qs },
    });
  };

  const handleSubmit = () => doSubmit(questions, answers);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-6">模拟考试</h1>

        {status === 'idle' && (
          <div className="bg-white rounded-xl shadow-md p-8 border border-slate-100">
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            <p className="text-slate-700 mb-4">
              模拟考试规则：
            </p>
            <ul className="list-disc list-inside text-slate-600 mb-6 space-y-2">
              <li>单选题 50 道</li>
              <li>多选题 40 道</li>
              <li>判断题 10 道</li>
              <li>共计 100 道题</li>
              <li>考试时长 2 小时</li>
              <li>交卷后自动记录成绩</li>
            </ul>
            <button
              onClick={startExam}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
            >
              开始考试
            </button>
          </div>
        )}

        {status === 'running' && questions.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow-sm">
              <span className="text-slate-700">
                第 {currentIndex + 1} / {questions.length} 题
              </span>
              <span className={`text-lg font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-slate-700'}`}>
                剩余时间：{formatTime(timeLeft)}
              </span>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                交卷
              </button>
            </div>

            <QuestionCard
              question={questions[currentIndex]}
              userAnswer={answers[questions[currentIndex].id] || ''}
              onSubmit={ans => setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: ans }))}
            />

            <div className="mt-6">
              <p className="text-sm font-medium text-slate-700 mb-2">答题卡</p>
              <div className="flex flex-wrap gap-2">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      i === currentIndex
                        ? 'bg-blue-600 text-white'
                        : answers[q.id]
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
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
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
