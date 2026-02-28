import { useLocation, Link } from 'react-router-dom';
import type { Question } from '../types';

export function ExamResult() {
  const location = useLocation();
  const state = location.state as {
    score?: number;
    correctCount?: number;
    total?: number;
    answers?: { questionId: string; userAnswer: string; correct: boolean }[];
    questions?: Question[];
  };

  if (!state || state.score === undefined) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-600 mb-4">未找到成绩信息</p>
        <Link to="/exam" className="text-blue-600 hover:underline">返回模拟考试</Link>
      </div>
    );
  }

  const { score = 0, correctCount = 0, total = 0, answers = [], questions = [] } = state;

  const pass = score >= 60;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">考试结果</h1>

      <div className="bg-white rounded-xl shadow-md p-8 mb-8 text-center border border-slate-100">
        <p className={`text-5xl font-bold mb-2 ${pass ? 'text-emerald-600' : 'text-red-600'}`}>
          {score} 分
        </p>
        <p className="text-slate-600 mb-4">
          答对 {correctCount} / {total} 题
        </p>
        <p className={`font-medium ${pass ? 'text-emerald-600' : 'text-red-600'}`}>
          {pass ? '恭喜，考试通过！' : '未通过，请继续努力'}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">答题详情</h2>
        {answers.length > 0 && questions.length > 0 && (
          <div className="space-y-4">
            {answers.slice(0, 10).map((a, i) => {
              const q = questions.find(qq => qq.id === a.questionId);
              if (!q) return null;
              return (
                <div
                  key={a.questionId}
                  className="p-4 bg-white rounded-lg shadow-sm border border-slate-100"
                >
                  <p className="text-slate-700 font-medium mb-2">
                    {i + 1}. {q.title}
                  </p>
                  <p className="text-sm text-slate-600">
                    你的答案：{a.userAnswer || '未作答'}
                    {!a.correct && (
                      <span className="text-red-600 ml-2">（正确答案：{q.correctAnswer}）</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">解析：{q.explanation}</p>
                </div>
              );
            })}
            {answers.length > 10 && (
              <p className="text-sm text-slate-500">仅展示前 10 题详情，完整记录可在成绩记录中查看</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          to="/exam"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          再次考试
        </Link>
        <Link
          to="/scores"
          className="px-6 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300"
        >
          查看成绩记录
        </Link>
        <Link
          to="/"
          className="px-6 py-2 text-slate-600 hover:text-slate-800"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
