import https from 'https';

// 配置
const TARGET_URL = 'https://practice.gjbkstcx.help';
const CONCURRENT_USERS = 200; // 模拟并发用户数
const REQUESTS_PER_USER = 5; // 每个用户发送的请求数

let successCount = 0;
let errorCount = 0;
let totalTime = 0;

function makeRequest() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    https.get(TARGET_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        if (res.statusCode === 200) {
          successCount++;
          totalTime += responseTime;
          console.log(`✓ 成功 - 响应时间: ${responseTime}ms`);
        } else {
          errorCount++;
          console.log(`✗ 失败 - 状态码: ${res.statusCode}`);
        }
        resolve();
      });
    }).on('error', (err) => {
      errorCount++;
      console.log(`✗ 错误: ${err.message}`);
      resolve();
    });
  });
}

async function runTest() {
  console.log('========================================');
  console.log('开始压力测试');
  console.log(`目标: ${TARGET_URL}`);
  console.log(`并发用户: ${CONCURRENT_USERS}`);
  console.log(`每用户请求数: ${REQUESTS_PER_USER}`);
  console.log(`总请求数: ${CONCURRENT_USERS * REQUESTS_PER_USER}`);
  console.log('========================================\n');

  const startTime = Date.now();

  // 创建并发请求
  const promises = [];
  for (let i = 0; i < CONCURRENT_USERS; i++) {
    for (let j = 0; j < REQUESTS_PER_USER; j++) {
      promises.push(makeRequest());
    }
  }

  await Promise.all(promises);

  const endTime = Date.now();
  const totalDuration = (endTime - startTime) / 1000;
  const avgResponseTime = successCount > 0 ? (totalTime / successCount).toFixed(2) : 0;
  const requestsPerSecond = ((successCount + errorCount) / totalDuration).toFixed(2);

  console.log('\n========================================');
  console.log('测试结果');
  console.log('========================================');
  console.log(`总请求数: ${successCount + errorCount}`);
  console.log(`成功: ${successCount}`);
  console.log(`失败: ${errorCount}`);
  console.log(`成功率: ${((successCount / (successCount + errorCount)) * 100).toFixed(2)}%`);
  console.log(`总耗时: ${totalDuration.toFixed(2)}秒`);
  console.log(`平均响应时间: ${avgResponseTime}ms`);
  console.log(`每秒请求数: ${requestsPerSecond} req/s`);
  console.log('========================================');
}

runTest();
