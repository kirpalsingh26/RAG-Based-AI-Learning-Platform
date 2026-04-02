import { useEffect, useMemo, useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

import { generateQuiz } from '../services/api';

const QuizPanel = ({ subject, subjects = [] }) => {
  const [quizItems, setQuizItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [quizSubject, setQuizSubject] = useState(subject || 'all');
  const [errorMessage, setErrorMessage] = useState('');

  const subjectOptions = useMemo(() => {
    const cleaned = Array.isArray(subjects)
      ? subjects.map((item) => String(item || '').trim().toLowerCase()).filter(Boolean)
      : [];

    const unique = [...new Set(cleaned)];
    return ['all', ...unique];
  }, [subjects]);

  useEffect(() => {
    setQuizSubject((current) => {
      if (current === 'all') return 'all';
      return subjectOptions.includes(current) ? current : (subject || 'all');
    });
  }, [subject, subjectOptions]);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await generateQuiz({ subject: quizSubject, count: 5 });
      const nextItems = Array.isArray(response.quiz) ? response.quiz : [];
      setQuizItems(nextItems);
      setRevealedAnswers({});
      if (!nextItems.length) {
        setErrorMessage('No quiz generated. Upload notes and try again.');
      }
    } catch (error) {
      setQuizItems([]);
      setErrorMessage(error.message || 'Unable to generate quiz right now. Try again in a few seconds.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.06 }}
      className="lift-on-hover rounded-3xl border border-white/60 bg-white/75 p-4 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70"
    >
      <div className="mb-3">
        <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Quiz Subject
        </label>
        <select
          value={quizSubject}
          onChange={(event) => setQuizSubject(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
        >
          {subjectOptions.map((option) => (
            <option key={option} value={option}>
              {option === 'all' ? 'All Subjects (Mixed MCQ)' : option.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleGenerateQuiz}
        disabled={isLoading}
        className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium transition hover:border-brand-200 hover:bg-brand-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
      >
        <BrainCircuit size={16} /> {isLoading ? 'Generating Quiz...' : 'Generate Quiz from Notes'}
      </button>

      {errorMessage ? (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="space-y-3">
        {!isLoading && !quizItems.length ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-300">
            Generate a quick self-test from your uploaded study material.
          </div>
        ) : null}

        {quizItems.map((quiz, index) => (
          <motion.div
            key={`${quiz.question}-${index}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm dark:border-slate-700 dark:bg-slate-800/40"
          >
            <p className="font-medium text-slate-800 dark:text-slate-100">Q{index + 1}. {quiz.question}</p>
            {Array.isArray(quiz.options) ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
                {quiz.options.map((option, optionIndex) => (
                  <li key={`${option}-${optionIndex}`}>{option}</li>
                ))}
              </ul>
            ) : null}

            {quiz.answer ? (
              <button
                type="button"
                onClick={() =>
                  setRevealedAnswers((previous) => ({
                    ...previous,
                    [index]: !previous[index],
                  }))
                }
                className="mt-2 text-xs font-medium text-brand-700 hover:underline dark:text-brand-100"
              >
                {revealedAnswers[index] ? 'Hide Answer' : 'Show Answer'}
              </button>
            ) : null}

            {quiz.answer && revealedAnswers[index] ? (
              <>
                <p className="mt-2 text-xs text-brand-700 dark:text-brand-100">Answer: {quiz.answer}</p>
                {quiz.explanation ? (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{quiz.explanation}</p>
                ) : null}
              </>
            ) : null}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default QuizPanel;
