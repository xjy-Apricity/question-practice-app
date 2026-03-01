#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# 解析题目和答案文件，生成TypeScript格式的题库

# 答案映射
answers = {
    # 单选题 1-60
    1: 'B', 2: 'C', 3: 'C', 4: 'A', 5: 'B', 6: 'D', 7: 'C', 8: 'D',
    9: 'A', 10: 'C', 11: 'D', 12: 'D', 13: 'C', 14: 'D', 15: 'A', 16: 'D',
    17: 'B', 18: 'B', 19: 'C', 20: 'B', 21: 'C', 22: 'B', 23: 'B', 24: 'C',
    25: 'D', 26: 'B', 27: 'B', 28: 'B', 29: 'B', 30: 'D', 31: 'A', 32: 'C',
    33: 'A', 34: 'D', 35: 'A', 36: 'C', 37: 'B', 38: 'B', 39: 'B', 40: 'C',
    41: 'A', 42: 'A', 43: 'B', 44: 'C', 45: 'C', 46: 'D', 47: 'C', 48: 'C',
    49: 'A', 50: 'A', 51: 'B', 52: 'A', 53: 'B', 54: 'A', 55: 'A', 56: 'B',
    57: 'A', 58: 'B', 59: 'C', 60: 'C',
    # 多选题 61-90
    61: 'BCD', 62: 'AD', 63: 'BC', 64: 'ABD', 65: 'ABC', 66: 'ABD', 67: 'ABCD', 68: 'BD',
    69: 'ABD', 70: 'BCD', 71: 'ABD', 72: 'AD', 73: 'ABCD', 74: 'ACD', 75: 'ABD', 76: 'AD',
    77: 'ABC', 78: 'ABCD', 79: 'BC', 80: 'ABD', 81: 'ACD', 82: 'ABCD', 83: 'ABC', 84: 'BD',
    85: 'BD', 86: 'ABCD', 87: 'ACD', 88: 'ACD', 89: 'ABCD', 90: 'ABD',
    # 判断题 91-100
    91: 'B', 92: 'A', 93: 'A', 94: 'B', 95: 'B', 96: 'A', 97: 'B', 98: 'B',
    99: 'A', 100: 'A'
}

# 题目类型映射
def get_question_type(num):
    if 1 <= num <= 60:
        return 'single'
    elif 61 <= num <= 90:
        return 'multiple'
    else:  # 91-100
        return 'judge'

# 读取题目文件
with open('题库文件/题目.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# 简单解析题目（这里需要根据实际格式调整）
import re

# 提取所有题目
questions = []
lines = content.split('\n')

current_question = None
current_options = []
question_num = 0

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    # 匹配题目编号
    match = re.match(r'^(\d+)\.(.+)', line)
    if match:
        # 保存上一题
        if current_question:
            questions.append({
                'num': question_num,
                'title': current_question,
                'options': current_options
            })
        
        question_num = int(match.group(1))
        current_question = match.group(2).strip()
        current_options = []
    elif line.startswith(('A、', 'B、', 'C、', 'D、')):
        current_options.append(line)

# 添加最后一题
if current_question:
    questions.append({
        'num': question_num,
        'title': current_question,
        'options': current_options
    })

# 生成TypeScript代码
output = []
for q in questions:
    num = q['num']
    q_type = get_question_type(num)
    answer = answers.get(num, '')
    
    # 判断题特殊处理
    if q_type == 'judge':
        options = ['A、正确', 'B、错误']
        correct_answer = '正确' if answer == 'A' else '错误'
    else:
        options = q['options']
        correct_answer = answer
    
    # 格式化选项
    options_str = ',\n      '.join([f"'{opt}'" for opt in options])
    
    ts_code = f"""  {{
    id: 'new_{num}',
    type: '{q_type}',
    title: '{num}.{q["title"]}',
    options: [
      {options_str}
    ],
    correctAnswer: '{correct_answer}',
    explanation: '参考答案：{answer}',
    category: '烟草专卖',
    difficulty: 2,
  }},"""
    
    output.append(ts_code)

# 输出到文件
with open('generated-questions.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print(f'已生成 {len(questions)} 道题目')
