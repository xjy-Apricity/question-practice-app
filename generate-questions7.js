import fs from 'fs';

// 答案映射 - 第七套题
const answers = {
  1: 'C', 2: 'B', 3: 'D', 4: 'B', 5: 'C', 6: 'D', 7: 'A', 8: 'D',
  9: 'B', 10: 'A', 11: 'B', 12: 'B', 13: 'D', 14: 'C', 15: 'D', 16: 'D',
  17: 'B', 18: 'B', 19: 'B', 20: 'D', 21: 'D', 22: 'C', 23: 'C', 24: 'D',
  25: 'A', 26: 'A', 27: 'C', 28: 'D', 29: 'A', 30: 'D', 31: 'C', 32: 'B',
  33: 'B', 34: 'B', 35: 'D', 36: 'A', 37: 'C', 38: 'D', 39: 'A', 40: 'B',
  41: 'B', 42: 'B', 43: 'C', 44: 'C', 45: 'A', 46: 'C', 47: 'A', 48: 'B',
  49: 'B', 50: 'A', 51: 'B', 52: 'B', 53: 'C', 54: 'D', 55: 'C', 56: 'A',
  57: 'B', 58: 'C', 59: 'B', 60: 'B',
  61: 'ABCD', 62: 'ABCD', 63: 'ABCD', 64: 'ABCD', 65: 'AB', 66: 'ABCD', 67: 'BC', 68: 'ABCD',
  69: 'ABC', 70: 'ABCD', 71: 'ABCD', 72: 'ABCD', 73: 'ABD', 74: 'BD', 75: 'ABD', 76: 'AD',
  77: 'BCD', 78: 'AC', 79: 'BCD', 80: 'BC', 81: 'AB', 82: 'AC', 83: 'ABCD', 84: 'ABCD',
  85: 'ABCD', 86: 'BCD', 87: 'ABC', 88: 'BC', 89: 'ABCD', 90: 'ABCD',
  91: 'A', 92: 'A', 93: 'A', 94: 'A', 95: 'B', 96: 'A', 97: 'B', 98: 'A',
  99: 'A', 100: 'B'
};

console.log('开始解析第七套题目...');

function getQuestionType(num) {
  if (num >= 1 && num <= 60) return 'single';
  if (num >= 61 && num <= 90) return 'multiple';
  return 'judge';
}

// 读取题目文件
const content = fs.readFileSync('题库文件/题目7.txt', 'utf-8');
const lines = content.split('\n');

const questions = [];
let buffer = [];
let currentNum = null;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;

  const match = line.match(/^(\d+)[\.\(（]/);
  if (match) {
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

if (currentNum && buffer.length > 0) {
  const text = buffer.join(' ').trim();
  questions.push({ num: currentNum, text });
}

console.log(`解析到 ${questions.length} 道题目`);

const tsCode = questions.map(q => {
  const num = q.num;
  const qType = getQuestionType(num);
  const answer = answers[num] || '';

  const text = q.text;
  const parts = text.split(/([A-D]、)/);
  const titleMatch = text.match(/^\d+[\.\(（](.+?)(?=[A-D]、)/s);
  const title = titleMatch ? titleMatch[1].trim() : text;

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
    id: 'new7_${num}',
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

const fullCode = `import type { Question } from '../types';

// 第七套题库（来自题库文件7）
export const NEW_QUESTIONS_7: Question[] = [
${tsCode}
];
`;

fs.writeFileSync('src/data/newQuestions7.ts', fullCode, 'utf-8');
console.log('第七套题库文件已生成: src/data/newQuestions7.ts');
