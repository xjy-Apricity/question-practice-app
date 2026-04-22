import fs from 'fs';

// 答案映射 - 第八套题
const answers = {
  1: 'A', 2: 'B', 3: 'C', 4: 'C', 5: 'D', 6: 'B', 7: 'C', 8: 'D',
  9: 'D', 10: 'B', 11: 'D', 12: 'A', 13: 'C', 14: 'C', 15: 'B', 16: 'C',
  17: 'D', 18: 'D', 19: 'B', 20: 'B', 21: 'C', 22: 'B', 23: 'D', 24: 'C',
  25: 'A', 26: 'B', 27: 'B', 28: 'A', 29: 'A', 30: 'B', 31: 'C', 32: 'D',
  33: 'C', 34: 'B', 35: 'C', 36: 'C', 37: 'C', 38: 'D', 39: 'B', 40: 'C',
  41: 'A', 42: 'C', 43: 'A', 44: 'D', 45: 'D', 46: 'A', 47: 'A', 48: 'D',
  49: 'C', 50: 'D', 51: 'D', 52: 'D', 53: 'C', 54: 'B', 55: 'A', 56: 'A',
  57: 'D', 58: 'B', 59: 'A', 60: 'C',
  61: 'ABD', 62: 'BC', 63: 'ABD', 64: 'ABCD', 65: 'ABCD', 66: 'AB', 67: 'AD', 68: 'ABD',
  69: 'ABC', 70: 'BC', 71: 'ABCD', 72: 'AD', 73: 'ACD', 74: 'AC', 75: 'AC', 76: 'CD',
  77: 'AB', 78: 'ABCD', 79: 'ABC', 80: 'ABCD', 81: 'ABC', 82: 'ABCD', 83: 'ABC', 84: 'AC',
  85: 'BCD', 86: 'ABCD', 87: 'ABC', 88: 'ABC', 89: 'AC', 90: 'AB',
  91: 'A', 92: 'A', 93: 'B', 94: 'A', 95: 'A', 96: 'A', 97: 'B', 98: 'B',
  99: 'B', 100: 'A'
};

console.log('开始解析第八套题目...');

function getQuestionType(num) {
  if (num >= 1 && num <= 60) return 'single';
  if (num >= 61 && num <= 90) return 'multiple';
  return 'judge';
}

const content = fs.readFileSync('题库文件/题目8.txt', 'utf-8');
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
    id: 'new8_${num}',
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

// 第八套题库（来自题库文件8）
export const NEW_QUESTIONS_8: Question[] = [
${tsCode}
];
`;

fs.writeFileSync('src/data/newQuestions8.ts', fullCode, 'utf-8');
console.log('第八套题库文件已生成: src/data/newQuestions8.ts');
