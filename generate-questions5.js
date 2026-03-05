import fs from 'fs';

// 答案映射 - 第五套题
const answers = {
  1: 'C', 2: 'D', 3: 'C', 4: 'B', 5: 'B', 6: 'D', 7: 'D', 8: 'A',
  9: 'D', 10: 'B', 11: 'C', 12: 'D', 13: 'D', 14: 'B', 15: 'C', 16: 'B',
  17: 'D', 18: 'C', 19: 'A', 20: 'A', 21: 'C', 22: 'A', 23: 'B', 24: 'D',
  25: 'D', 26: 'A', 27: 'A', 28: 'D', 29: 'B', 30: 'B', 31: 'C', 32: 'D',
  33: 'D', 34: 'B', 35: 'B', 36: 'A', 37: 'B', 38: 'D', 39: 'B', 40: 'C',
  41: 'B', 42: 'A', 43: 'D', 44: 'A', 45: 'D', 46: 'D', 47: 'B', 48: 'D',
  49: 'A', 50: 'A', 51: 'C', 52: 'A', 53: 'B', 54: 'C', 55: 'B', 56: 'C',
  57: 'C', 58: 'D', 59: 'C', 60: 'D',
  61: 'ABD', 62: 'ABD', 63: 'ABD', 64: 'ABC', 65: 'AB', 66: 'ACD', 67: 'ACD', 68: 'AC',
  69: 'BD', 70: 'ABC', 71: 'AB', 72: 'AD', 73: 'CD', 74: 'BCD', 75: 'AC', 76: 'ABCD',
  77: 'BC', 78: 'ACD', 79: 'BD', 80: 'ABD', 81: 'ABC', 82: 'AB', 83: 'BCD', 84: 'ABD',
  85: 'ABCD', 86: 'AC', 87: 'ABCD', 88: 'BC', 89: 'ABCD', 90: 'ACD', 91: 'ABC', 92: 'ABCD',
  93: 'CD', 94: 'BCD', 95: 'AC', 96: 'ABD', 97: 'BC', 98: 'AB', 99: 'AD', 100: 'ABD',
  101: 'BD', 102: 'ABC', 103: 'ABCD', 104: 'ACD', 105: 'ABCD', 106: 'ABC', 107: 'ABD', 108: 'BC',
  109: 'ACD', 110: 'BCD',
  111: 'A', 112: 'B', 113: 'B', 114: 'A', 115: 'B', 116: 'A', 117: 'A', 118: 'B',
  119: 'B', 120: 'A'
};

console.log('开始解析第五套题目...');

function getQuestionType(num) {
  if (num >= 1 && num <= 60) return 'single';
  if (num >= 61 && num <= 110) return 'multiple';
  return 'judge';
}

// 读取题目文件
const content = fs.readFileSync('题库文件/题目5.txt', 'utf-8');
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
    id: 'new5_${num}',
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

// 第五套题库（来自题库文件5）
export const NEW_QUESTIONS_5: Question[] = [
${tsCode}
];
`;

fs.writeFileSync('src/data/newQuestions5.ts', fullCode, 'utf-8');
console.log('第五套题库文件已生成: src/data/newQuestions5.ts');
