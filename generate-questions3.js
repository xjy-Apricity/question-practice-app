import fs from 'fs';

// 答案映射 - 第三套题
const answers = {
  1: 'D', 2: 'D', 3: 'C', 4: 'C', 5: 'C', 6: 'D', 7: 'A', 8: 'B',
  9: 'B', 10: 'D', 11: 'B', 12: 'D', 13: 'D', 14: 'C', 15: 'C', 16: 'B',
  17: 'A', 18: 'B', 19: 'C', 20: 'D', 21: 'C', 22: 'C', 23: 'B', 24: 'C',
  25: 'C', 26: 'B', 27: 'D', 28: 'A', 29: 'A', 30: 'B', 31: 'B', 32: 'B',
  33: 'C', 34: 'D', 35: 'D', 36: 'D', 37: 'D', 38: 'A', 39: 'D', 40: 'B',
  41: 'D', 42: 'B', 43: 'B', 44: 'D', 45: 'A', 46: 'A', 47: 'D', 48: 'C',
  49: 'C', 50: 'C', 51: 'C', 52: 'C', 53: 'C', 54: 'C', 55: 'B', 56: 'D',
  57: 'C', 58: 'D', 59: 'B', 60: 'D',
  61: 'BD', 62: 'ABD', 63: 'BC', 64: 'ABCD', 65: 'ABD', 66: 'AB', 67: 'BCD', 68: 'ABCD',
  69: 'AC', 70: 'ABCD', 71: 'ABCD', 72: 'ABCD', 73: 'BC', 74: 'ABCD', 75: 'ABD', 76: 'ABCD',
  77: 'AB', 78: 'ACD', 79: 'ABCD', 80: 'AB', 81: 'ABCD', 82: 'ABCD', 83: 'ABC', 84: 'AB',
  85: 'AB', 86: 'AC', 87: 'BCD', 88: 'ABCD', 89: 'BC', 90: 'BC',
  91: 'A', 92: 'B', 93: 'B', 94: 'A', 95: 'A', 96: 'B', 97: 'B', 98: 'A',
  99: 'B', 100: 'B'
};

console.log('开始解析第三套题目...');

function getQuestionType(num) {
  if (num >= 1 && num <= 60) return 'single';
  if (num >= 61 && num <= 90) return 'multiple';
  return 'judge';
}

// 读取题目文件
const content = fs.readFileSync('题库文件/题目3.txt', 'utf-8');
const lines = content.split('\n');

const questions = [];
let buffer = [];
let currentNum = null;

for (let line of lines) {
  line = line.trim();
  if (!line) continue;
  
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
    id: 'new3_${num}',
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

// 第三套题库（来自题库文件3）
export const NEW_QUESTIONS_3: Question[] = [
${tsCode}
];
`;

fs.writeFileSync('src/data/newQuestions3.ts', fullCode, 'utf-8');
console.log('第三套题库文件已生成: src/data/newQuestions3.ts');
