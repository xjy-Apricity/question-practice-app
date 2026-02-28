import { useState, useEffect } from 'react';
import { getQuestions, getQuestionsVersion, setQuestions as saveQuestionsToStorage } from '../utils/storage';
import { SAMPLE_QUESTIONS, QUESTION_BANK_VERSION } from '../data/questions';
import { getRandomQuestions, checkAnswer } from '../utils/questions';
import { addWrongRecord } from '../utils/storage';
import { QuestionCard } from '../components/QuestionCard';
import { useAuth } from '../contexts/AuthContext';
import type { Question } from '../types';

export function Practice() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const version = getQuestionsVersion();
    let all = getQuestions();
    if (all.length === 0 || version !== QUESTION_BANK_VERSION) {
      saveQuestionsToStorage(SAMPLE_QUESTIONS, QUESTION_BANK_VERSION);
      all = SAMPLE_QUESTIONS;
    }
    if (all.length === 0) {
      setLoading(false);
      return;
    }
    setQuestions(getRandomQuestions(all, 10));
    setLoading(false);
  }, []);

  const current = questions[currentIndex];

  const handleSubmit = () => {
    if (!current || !userAnswer) return;
    const isCorrect = checkAnswer(current, userAnswer);
    setCorrect(isCorrect);
    setShowResult(true);

    if (!isCorrect && user) {
      addWrongRecord(user.id, current.id, userAnswer);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setUserAnswer('');
    setCurrentIndex(i => (i < questions.length - 1 ? i + 1 : 0));
  };

  if (loading || questions.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600">
          {loading ? '加载中...' : '题库为空，请先导入题目'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">随机刷题</h1>
        <span className="text-slate-600">
          第 {currentIndex + 1} / {questions.length} 题
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
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
          >
            下一题
          </button>
        )}
      </div>
    </div>
  );
}
