import type { User, WrongRecord, ExamRecord, Question } from '../types';

const STORAGE_KEYS = {
  USER: 'qp_user',
  QUESTIONS: 'qp_questions',
  QUESTIONS_VERSION: 'qp_questions_version',
  WRONG_RECORDS: 'qp_wrong_records',
  EXAM_RECORDS: 'qp_exam_records',
} as const;

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
}

export function getQuestions(): Question[] {
  const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  return data ? JSON.parse(data) : [];
}

export function setQuestions(questions: Question[], version?: string): void {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  if (version !== undefined) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS_VERSION, version);
  }
}

export function getQuestionsVersion(): string | null {
  return localStorage.getItem(STORAGE_KEYS.QUESTIONS_VERSION);
}

export function getWrongRecords(userId: string): WrongRecord[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.WRONG_RECORDS}_${userId}`);
  return data ? JSON.parse(data) : [];
}

export function setWrongRecords(userId: string, records: WrongRecord[]): void {
  localStorage.setItem(`${STORAGE_KEYS.WRONG_RECORDS}_${userId}`, JSON.stringify(records));
}

export function addWrongRecord(userId: string, questionId: string, userAnswer: string): void {
  const records = getWrongRecords(userId);
  const existing = records.find(r => r.questionId === questionId);
  if (existing) {
    existing.userAnswer = userAnswer;
    existing.wrongCount += 1;
    existing.lastWrongAt = new Date().toISOString();
  } else {
    records.push({
      questionId,
      userAnswer,
      wrongCount: 1,
      lastWrongAt: new Date().toISOString(),
    });
  }
  setWrongRecords(userId, records);
}

export function removeWrongRecord(userId: string, questionId: string): void {
  const records = getWrongRecords(userId).filter(r => r.questionId !== questionId);
  setWrongRecords(userId, records);
}

export function getExamRecords(userId: string): ExamRecord[] {
  const data = localStorage.getItem(`${STORAGE_KEYS.EXAM_RECORDS}_${userId}`);
  return data ? JSON.parse(data) : [];
}

export function addExamRecord(record: ExamRecord): void {
  const records = getExamRecords(record.userId);
  records.unshift(record);
  localStorage.setItem(`${STORAGE_KEYS.EXAM_RECORDS}_${record.userId}`, JSON.stringify(records));
}
