import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuestions, getWrongRecords, removeWrongRecord, addWrongRecord } from '../utils/storage';
import { checkAnswer } from '../utils/questions';
import { QuestionCard } from '../components/QuestionCard';
import { useAuth } from '../contexts/AuthContext';
import type { Question } from '../types';

export function WrongPractice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  // 记录每道题的答题历史
  const [answerHistory, setAnswerHistory] = useState<Record<number, { answer: string; correct: boolean; submitted: boolean }>>({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const records = getWrongRecords(user.id);
    const ids = records.map(r => r.questionId);
    const all = getQuestions();
    const wrongQuestions = all.filter(q => ids.includes(q.id));
    setQuestions(wrongQuestions);
    setLoading(false);
  }, [user, navigate]);

  // 当切换题目时，恢复该题的答题状态
  useEffect(() => {
    const history = answerHistory[currentIndex];
    if (history) {
      setUserAnswer(history.answer);
      setShowResult(history.submitted);
      setCorrect(history.correct);
    } else {
      setUserAnswer('');
      setShowResult(false);
      setCorrect(false);
    }
  }, [currentIndex, answerHistory]);

  const current = questions[currentIndex];

  const handleSubmit = () => {
    if (!current || !userAnswer) return;
    const isCorrect = checkAnswer(current, userAnswer);
    setCorrect(isCorrect);
    setShowResult(true);

    // 保存答题历史
    setAnswerHistory(prev => ({
      ...prev,
      [currentIndex]: { answer: userAnswer, correct: isCorrect, submitted: true }
    }));

    // 如果回答错误，更新错题记录
    if (!isCorrect && user) {
      addWrongRecord(user.id, current.id, userAnswer);
    }

    // 如果回答正确，0.8秒后自动跳转到下一题
    if (isCorrect) {
      setTimeout(() => {
        handleNext();
      }, 800);
    }
  };

  const handleNext = () => {
    setCurrentIndex(i => (i < questions.length - 1 ? i + 1 : 0));
  };

  const handleRemove = () => {
    if (!user || !current) return;
    removeWrongRecord(user.id, current.id);
    setQuestions(prev => {
      const newQuestions = prev.filter(q => q.id !== current.id);
      // 如果没有题目了，返回错题本
      if (newQuestions.length === 0) {
        navigate('/wrong-book');
        return prev;
      }
      return newQuestions;
    });
    // 调整索引
    setCurrentIndex(i => Math.min(i, questions.length - 2));
    // 清空当前题的历史记录
    setAnswerHistory(prev => {
      const newHistory: Record<number, { answer: string; correct: boolean; submitted: boolean }> = {};
      Object.keys(prev).forEach(key => {
        const idx = parseInt(key);
        if (idx < currentIndex) {
          newHistory[idx] = prev[idx];
        } else if (idx > currentIndex) {
          newHistory[idx - 1] = prev[idx];
        }
      });
      return newHistory;
    });
  };

  const handlePrev = () => {
    setCurrentIndex(i => (i > 0 ? i - 1 : questions.length - 1));
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600">加载中...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">错题本</h1>
        <p className="text-slate-600 mb-4">请先登录以查看错题本</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">错题本</h1>
        <p className="text-slate-600 mb-4">暂无错题，去刷题吧！</p>
        <button
          onClick={() => navigate('/practice')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          开始刷题
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">错题回刷</h1>
        <span className="text-slate-600">
          共 {questions.length} 题，第 {currentIndex + 1} 题
        </span>
      </div>

      <QuestionCard
        question={current}
        userAnswer={userAnswer}
        onSubmit={setUserAnswer}
        showResult={showResult}
        correct={correct}
        disabled={showResult}
      />

      {showResult && (
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className={`font-medium mb-2 ${correct ? 'text-green-600' : 'text-red-600'}`}>
            {correct ? '回答正确！' : '回答错误'}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">解析：</span>
            {current.explanation}
          </p>
          <p className="text-sm text-slate-600 mt-2">
            正确答案：{current.correctAnswer}
          </p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={handlePrev}
          className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
        >
          上一题
        </button>
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            提交答案
          </button>
        ) : (
          <>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
            >
              下一题
            </button>
            {correct && (
              <button
                onClick={handleRemove}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                已掌握，移出错题本
              </button>
            )}
          </>
        )}
        <button
          onClick={() => navigate('/wrong-book')}
          className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 ml-auto"
        >
          返回错题本
        </button>
      </div>
    </div>
  );
}
