import fs from 'fs';

// 答案映射 - 第二套题
const answers = {
  1: 'A', 2: 'D', 3: 'C', 4: 'D', 5: 'B', 6: 'D', 7: 'A', 8: 'C',
  9: 'A', 10: 'D', 11: 'C', 12: 'B', 13: 'C', 14: 'A', 15: 'D', 16: 'B',
  17: 'B', 18: 'B', 19: 'B', 20: 'A', 21: 'B', 22: 'C', 23: 'B', 24: 'A',
  25: 'B', 26: 'B', 27: 'B', 28: 'A', 29: 'C', 30: 'C', 31: 'B', 32: 'B',
  33: 'B', 34: 'B', 35: 'C', 36: 'D', 37: 'D', 38: 'B', 39: 'C', 40: 'D',
  41: 'B', 42: 'B', 43: 'B', 44: 'C', 45: 'A', 46: 'D', 47: 'C', 48: 'B',
  49: 'D', 50: 'A', 51: 'A', 52: 'D', 53: 'B', 54: 'C', 55: 'B', 56: 'D',
  57: 'B', 58: 'C', 59: 'C', 60: 'A',
  61: 'ABD', 62: 'ABC', 63: 'ABCD', 64: 'ABCD', 65: 'ABCD', 66: 'BC', 67: 'BCD', 68: 'ABC',
  69: 'BC', 70: 'ABC', 71: 'AD', 72: 'ABC', 73: 'CD', 74: 'ABCD', 75: 'ABCD', 76: 'ACD',
  77: 'CD', 78: 'ABD', 79: 'ABCD', 80: 'ABC', 81: 'ABD', 82: 'BC', 83: 'BCD', 84: 'BD',
  85: 'ABC', 86: 'BC', 87: 'ABC', 88: 'ABCD', 89: 'AB', 90: 'ACD',
  91: 'A', 92: 'A', 93: 'B', 94: 'B', 95: 'B', 96: 'A', 97: 'B', 98: 'B',
  99: 'A', 100: 'A'
};

console.log('开始解析第二套题目...');

function getQuestionType(num) {
  if (num >= 1 && num <= 60) return 'single';
  if (num >= 61 && num <= 90) return 'multiple';
  return 'judge';
}

// 读取题目文件
const content = fs.readFileSync('题库文件/题目2.txt', 'utf-8');
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
    id: 'new2_${num}',
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

// 第二套题库（来自题库文件2）
export const NEW_QUESTIONS_2: Question[] = [
${tsCode}
];
`;

fs.writeFileSync('src/data/newQuestions2.ts', fullCode, 'utf-8');
console.log('第二套题库文件已生成: src/data/newQuestions2.ts');
