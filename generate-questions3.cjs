const fs = require('fs');

// 读取题目和答案文件
const questionsText = fs.readFileSync('./题库文件/题目3.txt', 'utf-8');
const answersText = fs.readFileSync('./题库文件/答案3.txt', 'utf-8');

// 解析答案
const answerLines = answersText.split('\n').filter(line => line.trim());
const answerMap = {};

answerLines.forEach(line => {
  const match = line.match(/(\d+)\.([\s\S]+)/);
  if (match) {
    const questionNum = parseInt(match[1]);
    const answer = match[2].trim();
    answerMap[questionNum] = answer;
  }
});

// 解析题目
const questions = [];
const questionBlocks = questionsText.split(/(?=\d+\.)/);

questionBlocks.forEach(block => {
  const lines = block.trim().split('\n');
  if (lines.length === 0 || !lines[0].match(/^\d+\./)) return;

  const firstLine = lines[0];
  const match = firstLine.match(/^(\d+)\.([\s\S]+)/);
  if (!match) return;

  const questionNum = parseInt(match[1]);
  let questionText = match[2].trim();
  let options = [];
  let type = 'single'; // 默认单选

  // 收集完整的题目文本和选项
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^[A-D]、/)) {
      options.push(line);
    } else if (line) {
      questionText += line;
    }
  }

  // 判断题目类型
  if (questionNum >= 61 && questionNum <= 90) {
    type = 'multiple';
  } else if (questionNum >= 91 && questionNum <= 100) {
    type = 'judge';
  }

  // 获取答案
  const answer = answerMap[questionNum] || '';

  // 处理判断题
  if (type === 'judge') {
    questions.push({
      id: 200 + questionNum,
      question: questionText,
      type: 'judge',
      correctAnswer: answer === 'A' ? 'true' : 'false'
    });
  } else {
    // 处理选择题
    const formattedOptions = options.map(opt => {
      const optMatch = opt.match(/^([A-D])、(.+)/);
      return optMatch ? optMatch[2].trim() : opt;
    });

    questions.push({
      id: 200 + questionNum,
      question: questionText,
      options: formattedOptions,
      type: type,
      correctAnswer: answer
    });
  }
});

// 生成 TypeScript 文件
const tsContent = `import { Question } from '../types';

export const NEW_QUESTIONS_3: Question[] = ${JSON.stringify(questions, null, 2)};
`;

fs.writeFileSync('./src/data/newQuestions3.ts', tsContent, 'utf-8');
console.log(`成功生成 ${questions.length} 道题目到 newQuestions3.ts`);
