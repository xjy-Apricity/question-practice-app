import fs from 'fs';
import path from 'path';

// 答案映射
const answers = {
  1: 'B', 2: 'C', 3: 'C', 4: 'A', 5: 'B', 6: 'D', 7: 'C', 8: 'D',
  9: 'A', 10: 'C', 11: 'D', 12: 'D', 13: 'C', 14: 'D', 15: 'A', 16: 'D',
  17: 'B', 18: 'B', 19: 'C', 20: 'B', 21: 'C', 22: 'B', 23: 'B', 24: 'C',
  25: 'D', 26: 'B', 27: 'B', 28: 'B', 29: 'B', 30: 'D', 31: 'A', 32: 'C',
  33: 'A', 34: 'D', 35: 'A', 36: 'C', 37: 'B', 38: 'B', 39: 'B', 40: 'C',
  41: 'A', 42: 'A', 43: 'B', 44: 'C', 45: 'C', 46: 'D', 47: 'C', 48: 'C',
  49: 'A', 50: 'A', 51: 'B', 52: 'A', 53: 'B', 54: 'A', 55: 'A', 56: 'B',
  57: 'A', 58: 'B', 59: 'C', 60: 'C',
  61: 'BCD', 62: 'AD', 63: 'BC', 64: 'ABD', 65: 'ABC', 66: 'ABD', 67: 'ABCD', 68: 'BD',
  69: 'ABD', 70: 'BCD', 71: 'ABD', 72: 'AD', 73: 'ABCD', 74: 'ACD', 75: 'ABD', 76: 'AD',
  77: 'ABC', 78: 'ABCD', 79: 'BC', 80: 'ABD', 81: 'ACD', 82: 'ABCD', 83: 'ABC', 84: 'BD',
  85: 'BD', 86: 'ABCD', 87: 'ACD', 88: 'ACD', 89: 'ABCD', 90: 'ABD',
  91: 'B', 92: 'A', 93: 'A', 94: 'B', 95: 'B', 96: 'A', 97: 'B', 98: 'B',
  99: 'A', 100: 'A'
};

console.log('开始解析题目...');

function getQuestionType(num) {
  if (num >= 1 && num <= 60) return 'single';
  if (num >= 61 && num <= 90) return 'multiple';
  return 'judge';
}

// 读取题目文件
const content = fs.readFileSync('题库文件/题目.txt', 'utf-8');
const lines = content.split('\n');

const questions = [];
let buffer = [];
let currentNum = null;

for (let line of lines) {
  line = line.trim();
  
  // 匹配题号
  const match = line.match(/^(\d+)\./);
  if (match) {
    // 处理上一题
    if (currentNum && buffer.length > 0) {
      const text = buffer.join(' ').trim();
      questions.push({ num: currentNum, text });
    }
    
    currentNum = parseInt(match[1]);
    buffer = [line];
  } else if (currentNum && line) {
    buffer.push(line);
  }
}

// 处理最后一题
if (currentNum && buffer.length > 0) {
  const text = buffer.join(' ').trim();
  questions.push({ num: currentNum, text });
}

console.log(`解析到 ${questions.length} 道题目`);

// 生成TypeScript代码
const tsCode = questions.map(q => {
  const num = q.num;
  const qType = getQuestionType(num);
  const answer = answers[num] || '';
  
  // 提取题目和选项
  const text = q.text;
  const parts = text.split(/([A-D]、)/);
  const titleMatch = text.match(/^\d+\.(.+?)(?=[A-D]、)/s);
  const title = titleMatch ? titleMatch[1].trim() : text;
  
  // 提取选项
  const options = [];
  for (let i = 1; i < parts.length; i += 2) {
    if (parts[i] && parts[i + 1]) {
      const opt = parts[i] + parts[i + 1].split(/[A-D]、/)[0].trim();
      options.push(opt);
    }
  }
  
  let finalOptions, correctAnswer;
  
  if (qType === 'judge') {
    finalOptions = ['A、正确', 'B、错误'];
    correctAnswer = answer === 'A' ? '正确' : '错误';
  } else {
    finalOptions = options.length > 0 ? options : ['A、选项A', 'B、选项B', 'C、选项C', 'D、选项D'];
    correctAnswer = answer;
  }
  
  const escapedTitle = title.replace(/'/g, "\\'").replace(/\n/g, ' ');
  const optionsStr = finalOptions.map(opt => `'${opt.replace(/'/g, "\\'").replace(/\n/g, ' ')}'`).join(',\n      ');
  
  return `  {
    id: 'new_${num}',
    type: '${qType}',
    title: '${num}.${escapedTitle}',
    options: [
      ${optionsStr}
    ],
    correctAnswer: '${correctAnswer}',
    explanation: '参考答案：${answer}',
    category: '烟草专卖',
    difficulty: 2,
  }`;
}).join(',\n');

// 生成完整的TypeScript文件
const fullCode = `import type { Question } from '../types';

// 新增题库（来自题库文件）
export const NEW_QUESTIONS: Question[] = [
${tsCode}
];
`;

fs.writeFileSync('src/data/newQuestions.ts', fullCode, 'utf-8');
console.log('题库文件已生成: src/data/newQuestions.ts');
