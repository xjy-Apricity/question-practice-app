import fs from 'fs';

// 读取所有题库文件并统计
const files = [
  './src/data/newQuestions.ts',
  './src/data/newQuestions2.ts',
  './src/data/newQuestions3.ts',
  './src/data/newQuestions4.ts',
  './src/data/newQuestions5.ts',
  './src/data/newQuestions6.ts'
];

let totalQuestions = 0;
const stats = [];

files.forEach((file, index) => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // 统计题目数量（通过匹配 id: 'new 来计数）
  const matches = content.match(/id: 'new\d*_\d+'/g);
  const count = matches ? matches.length : 0;
  
  totalQuestions += count;
  stats.push({
    file: `题库${index + 1}`,
    count: count
  });
});

console.log('=== 题库统计 ===');
stats.forEach(stat => {
  console.log(`${stat.file}: ${stat.count} 道题`);
});
console.log(`\n总计: ${totalQuestions} 道题`);

// 检查 questions.ts 文件
const questionsFile = fs.readFileSync('./src/data/questions.ts', 'utf-8');
const imports = questionsFile.match(/import.*from.*newQuestions/g);
console.log(`\n=== questions.ts 导入检查 ===`);
console.log(`导入数量: ${imports ? imports.length : 0} 个题库`);
console.log(`预期数量: 6 个题库`);

if (imports && imports.length === 6) {
  console.log('✅ 所有题库都已正确导入');
} else {
  console.log('❌ 题库导入不完整');
}

// 检查是否所有题库都在 SAMPLE_QUESTIONS 中
const sampleQuestionsLine = questionsFile.match(/SAMPLE_QUESTIONS.*=.*\[.*\]/s);
if (sampleQuestionsLine) {
  const hasAll = [1, 2, 3, 4, 5, 6].every(num => 
    sampleQuestionsLine[0].includes(`NEW_QUESTIONS${num === 1 ? '' : '_' + num}`)
  );
  
  if (hasAll) {
    console.log('✅ 所有题库都已添加到 SAMPLE_QUESTIONS');
  } else {
    console.log('❌ 部分题库未添加到 SAMPLE_QUESTIONS');
  }
}

console.log('\n=== 检查完成 ===');
