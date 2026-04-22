import type { Question } from '../types';
import { NEW_QUESTIONS } from './newQuestions';
import { NEW_QUESTIONS_2 } from './newQuestions2';
import { NEW_QUESTIONS_3 } from './newQuestions3';
import { NEW_QUESTIONS_4 } from './newQuestions4';
import { NEW_QUESTIONS_5 } from './newQuestions5';
import { NEW_QUESTIONS_6 } from './newQuestions6';
import { NEW_QUESTIONS_7 } from './newQuestions7';
import { NEW_QUESTIONS_8 } from './newQuestions8';

export const SAMPLE_QUESTIONS: Question[] = [...NEW_QUESTIONS, ...NEW_QUESTIONS_2, ...NEW_QUESTIONS_3, ...NEW_QUESTIONS_4, ...NEW_QUESTIONS_5, ...NEW_QUESTIONS_6, ...NEW_QUESTIONS_7, ...NEW_QUESTIONS_8];

// 题库版本，更新时 LocalStorage 中的旧数据会被覆盖
export const QUESTION_BANK_VERSION = '12';
