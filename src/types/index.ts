// 题目类型
export type QuestionType = 'single' | 'multiple' | 'judge';

// 题目
export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  options: string[];
  correctAnswer: string; // 单选: "A" | 多选: "A,B,C" | 判断: "正确" 或 "错误"
  explanation: string;
  category?: string;
  difficulty?: 1 | 2 | 3;
}

// 用户
export interface User {
  id: string;
  email: string;
  username?: string;
}

// 错题记录
export interface WrongRecord {
  questionId: string;
  userAnswer: string;
  wrongCount: number;
  lastWrongAt: string;
}

// 考试答案
export interface ExamAnswer {
  questionId: string;
  userAnswer: string;
  correct: boolean;
}

// 考试记录
export interface ExamRecord {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  answers: ExamAnswer[];
}
