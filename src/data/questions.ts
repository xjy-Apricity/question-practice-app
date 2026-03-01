import type { Question } from '../types';
import { NEW_QUESTIONS } from './newQuestions';
import { NEW_QUESTIONS_2 } from './newQuestions2';
import { NEW_QUESTIONS_3 } from './newQuestions3';

export const SAMPLE_QUESTIONS: Question[] = [...NEW_QUESTIONS, ...NEW_QUESTIONS_2, ...NEW_QUESTIONS_3];

// 题库版本，更新时 LocalStorage 中的旧数据会被覆盖
export const QUESTION_BANK_VERSION = '7';
