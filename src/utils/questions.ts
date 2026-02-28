import type { Question } from '../types';

// Fisher-Yates 洗牌算法
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 随机抽题（刷题模式）
export function getRandomQuestions(questions: Question[], count: number): Question[] {
  return shuffle(questions).slice(0, count);
}

// 模拟考试抽题：单选50 + 多选40 + 判断10
export function getExamQuestions(questions: Question[]): Question[] {
  const single = shuffle(questions.filter(q => q.type === 'single')).slice(0, 50);
  const multiple = shuffle(questions.filter(q => q.type === 'multiple')).slice(0, 40);
  const judge = shuffle(questions.filter(q => q.type === 'judge')).slice(0, 10);

  if (single.length < 50 || multiple.length < 40 || judge.length < 10) {
    throw new Error('题库数量不足，无法开始模拟考试。需要：单选≥50、多选≥40、判断≥10');
  }

  return [...single, ...multiple, ...judge];
}

// 判分：单选/判断题
export function checkSingleAnswer(correct: string, user: string): boolean {
  return normalizeAnswer(correct) === normalizeAnswer(user);
}

// 判分：多选题（必须完全一致）
export function checkMultipleAnswer(correct: string, user: string): boolean {
  const c = normalizeAnswer(correct).split(',').sort().join(',');
  const u = normalizeAnswer(user).split(',').sort().join(',');
  return c === u;
}

export function checkAnswer(question: Question, userAnswer: string): boolean {
  const correct = question.correctAnswer;
  if (question.type === 'multiple') {
    return checkMultipleAnswer(correct, userAnswer);
  }
  return checkSingleAnswer(correct, userAnswer);
}

function normalizeAnswer(s: string): string {
  return (s || '').trim().replace(/[，,]/g, ',').toUpperCase();
}
