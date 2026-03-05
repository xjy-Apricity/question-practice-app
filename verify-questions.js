import fs from 'fs';

console.log('=== 题库完整性检查 ===\n');

// 检查每个题库文件
const files = [
  { path: './src/data/newQuestions.ts', name: '题库1' },
  { path: './src/data/newQuestions2.ts', name: '题库2' },
  { path: './src/data/newQuestions3.ts', name: '题库3' },
  { path: './src/data/newQuestions4.ts', name: '题库4' },
  { path: './src/data/newQuestions5.ts', name: '题库5' },
  { path: './src/data/newQuestions6.ts', name: '题库6' }
];

let allValid = true;
let totalCount = 0;

files.forEach(({ path, name }) => {
  const content = fs.readFileSync(path, 'utf-8');
  
  // 检查导出语句
  const hasExport = /export const NEW_QUESTIONS(_\d+)?: Question\[\]/.test(content);
  
  // 统计题目数量
  const questionMatches = content.match(/\{\s*id:/g);
  const count = questionMatches ? questionMatches.length : 0;
  totalCount += count;
  
  // 检查题目结构
  const hasValidStructure = content.includes('id:') && 
                           content.includes('type:') && 
                           content.includes('title:') && 
                           content.includes('options:') && 
                           content.includes('correctAnswer:');
  
  const status = hasExport && hasValidStructure && count > 0 ? '✅' : '❌';
  
  console.log(`${status} ${name}:`);
  console.log(`   - 题目数量: ${count}`);
  console.log(`   - 导出语句: ${hasExport ? '正确' : '错误'}`);
  console.log(`   - 题目结构: ${hasValidStructure ? '完整' : '不完整'}`);
  
  if (!hasExport || !hasValidStructure || count === 0) {
    allValid = false;
  }
});

console.log(`\n总计: ${totalCount} 道题\n`);

// 检查 questions.ts
console.log('=== questions.ts 检查 ===');
const questionsContent = fs.readFileSync('./src/data/questions.ts', 'utf-8');

// 检查所有导入
const expectedImports = [
  'NEW_QUESTIONS',
  'NEW_QUESTIONS_2',
  'NEW_QUESTIONS_3',
  'NEW_QUESTIONS_4',
  'NEW_QUESTIONS_5',
  'NEW_QUESTIONS_6'
];

const allImported = expectedImports.every(imp => questionsContent.includes(imp));
console.log(`${allImported ? '✅' : '❌'} 所有题库已导入`);

// 检查 SAMPLE_QUESTIONS 数组
const hasSampleQuestions = questionsContent.includes('export const SAMPLE_QUESTIONS');
console.log(`${hasSampleQuestions ? '✅' : '❌'} SAMPLE_QUESTIONS 已定义`);

// 检查所有题库是否都在数组中
const allInArray = expectedImports.every(imp => 
  new RegExp(`\\.\\.\\.\s*${imp}`).test(questionsContent)
);
console.log(`${allInArray ? '✅' : '❌'} 所有题库已添加到数组`);

// 检查版本号
const versionMatch = questionsContent.match(/QUESTION_BANK_VERSION = '(\d+)'/);
if (versionMatch) {
  console.log(`✅ 版本号: ${versionMatch[1]}`);
}

console.log('\n=== 最终结果 ===');
if (allValid && allImported && hasSampleQuestions && allInArray) {
  console.log('✅ 所有检查通过！题库可以正常使用。');
  console.log(`📊 共有 ${totalCount} 道题目可供练习。`);
} else {
  console.log('❌ 存在问题，请检查上述错误。');
}
