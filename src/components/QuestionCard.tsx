import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  userAnswer: string | string[];
  onSubmit?: (answer: string) => void;
  showResult?: boolean;
  correct?: boolean;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  userAnswer,
  onSubmit,
  showResult,
  correct,
  disabled,
}: QuestionCardProps) {
  const isMultiple = question.type === 'multiple';
  const answer = Array.isArray(userAnswer) ? userAnswer : (userAnswer ? [userAnswer] : []);

  const handleChange = (opt: string) => {
    if (disabled) return;
    const val = opt.split('.')[0].trim();
    if (isMultiple) {
      const newAns = answer.includes(val)
        ? answer.filter(a => a !== val)
        : [...answer, val];
      onSubmit?.(newAns.sort().join(','));
    } else {
      onSubmit?.(val);
    }
  };

  const typeLabel =
    question.type === 'single' ? '单选题' : question.type === 'multiple' ? '多选题' : '判断题';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
      <span className="inline-block px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded mb-4">
        {typeLabel}
      </span>
      <h2 className="text-lg text-slate-800 mb-6 leading-relaxed">{question.title}</h2>
      <div className="space-y-3">
        {question.options.map(opt => {
          const val = opt.split('.')[0].trim();
          const checked = answer.includes(val);
          let borderClass = 'border-slate-200';
          if (showResult) {
            if (checked) {
              borderClass = correct
                ? 'border-green-500 bg-green-50'
                : 'border-red-500 bg-red-50';
            }
          } else if (checked) {
            borderClass = 'border-blue-500 bg-blue-50';
          }

          return (
            <label
              key={opt}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${borderClass} ${disabled ? 'cursor-not-allowed opacity-80' : 'hover:bg-slate-50'}`}
            >
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name={question.id}
                value={val}
                checked={checked}
                onChange={() => handleChange(opt)}
                disabled={disabled}
                className="mr-3"
              />
              <span className="text-slate-800">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
