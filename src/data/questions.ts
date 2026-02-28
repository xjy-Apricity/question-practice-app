import type { Question } from '../types';

// 理论.docx 中的题目
export const THEORY_QUESTIONS: Question[] = [
  {
    id: 'theory_1',
    type: 'single',
    title: '1．市级局发现烟叶复烤加工企业违规问题，要在当天向(  )报告。',
    options: ['A. 国家局', 'B. 省级局', 'C. 市级人民政府', 'D. 市检察机关'],
    correctAnswer: 'A',
    explanation: '市级局发现烟叶复烤加工企业违规问题，要在当天向国家局报告。',
    category: '烟草专卖',
    difficulty: 2,
  },
  {
    id: 'theory_2',
    type: 'single',
    title: '2．用各种仪器、设备，并利用化学试剂对商品的质量特性进行物理的、机械的、化学的、生物学的测定与分析的鉴定过程是(  )。',
    options: ['A. 感官检验', 'B. 物理检验', 'C. 理化检验', 'D. 仪器检验'],
    correctAnswer: 'B',
    explanation: '理化检验是指用各种仪器、设备，并利用化学试剂对商品的质量特性进行物理的、机械的、化学的、生物学的测定与分析。',
    category: '烟草专卖',
    difficulty: 2,
  },
  {
    id: 'theory_3',
    type: 'single',
    title: '3．邮寄、异地携带烟叶、烟草制品以及个人进入中国境内携带烟草制品的，实行(  )制度。',
    options: ['A. 禁止', 'B. 不限制', 'C. 准运证', 'D. 限量'],
    correctAnswer: 'B',
    explanation: '邮寄、异地携带烟叶、烟草制品以及个人进入中国境内携带烟草制品的，实行限量制度。',
    category: '烟草专卖',
    difficulty: 2,
  },
  {
    id: 'theory_4',
    type: 'single',
    title: '4．以下不属于日常市场检查计划制定依据的是(  )。',
    options: [
      'A. 学习理解上级有关文件精神，了解掌握计划期内的上级对专卖管理工作的部署和要求',
      'B. 广泛开展调查摸底，充分了解辖区内卷烟零售市场的基本情况',
      'C. 辖区卷烟销量、品牌、价格波动状况',
      'D. 市场稽查线路和人员的安排',
    ],
    correctAnswer: 'C',
    explanation: '日常市场检查计划制定依据包括上级文件精神、辖区市场情况等，辖区卷烟销量、品牌、价格波动状况不属于制定依据。',
    category: '烟草专卖',
    difficulty: 2,
  },
  {
    id: 'theory_5',
    type: 'single',
    title: '5．在调查组下面分设若干调查小组分头调查，属于(  )方式确定调查取证组织方式，适用于涉及面广、调查取证难度较大的案件。',
    options: ['A. 横向联合', 'B. 单一式', 'C. 母子式', 'D. 单独式'],
    correctAnswer: 'A',
    explanation: '在调查组下面分设若干调查小组分头调查，属于横向联合方式。',
    category: '烟草专卖',
    difficulty: 2,
  },
  {
    id: 'theory_6',
    type: 'single',
    title: '6．假冒注册商标罪客观方面表现为违反国家商标管理规定，未经(  )许可，在同一种商品上使用与其注册商标相同的商标，情节严重的行为。',
    options: [
      'A. 国家商标行政管理部门',
      'B. 注册商标所有人',
      'C. 注册商标使用人',
      'D. 烟草专卖行政主管部门',
    ],
    correctAnswer: 'D',
    explanation: '假冒注册商标罪未经注册商标所有人许可。',
    category: '烟草专卖',
    difficulty: 2,
  },
  {
    id: 'theory_7',
    type: 'single',
    title: '7．对卷烟、雪茄烟生产企业内部专卖监督管理的重点包括：卷烟、雪茄烟生产企业是否严格按照专卖法律法规和行业规范要求对(  )进行管理。',
    options: ['A. 物资', 'B. 人力资源', 'C. 专卖品', 'D. 国有资产'],
    correctAnswer: 'B',
    explanation: '内部专卖监督管理的重点是对专卖品进行管理。',
    category: '烟草专卖',
    difficulty: 2,
  },
  {
    id: 'theory_8',
    type: 'single',
    title: '8．《烟草专卖法实施条例》规定烟草专卖行政主管部门或者烟草专卖行政主管部门(  )有关部门，可以依法对非法运输烟草专卖品的活动进行检查、处理。',
    options: ['A. 委托', 'B. 授权', 'C. 指定', 'D. 会同'],
    correctAnswer: 'B',
    explanation: '烟草专卖行政主管部门会同有关部门可以依法对非法运输烟草专卖品的活动进行检查、处理。',
    category: '烟草专卖',
    difficulty: 2,
  },
];

export const SAMPLE_QUESTIONS: Question[] = [...THEORY_QUESTIONS];

// 题库版本，更新时 LocalStorage 中的旧数据会被覆盖
export const QUESTION_BANK_VERSION = '2';
