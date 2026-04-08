import { useMemo, useState } from 'react';
import { ArrowLeft, ChevronRight, Code2, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { PROBLEMS } from '../data/codingProblems';

const SOLVED_PROBLEMS_STORAGE_KEY = 'codingSolvedProblems';

const loadSolvedProblemIds = () => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(SOLVED_PROBLEMS_STORAGE_KEY);
    const parsed = JSON.parse(raw || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const difficultyStyles = {
  Easy: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30',
  Medium: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30',
  Hard: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30',
};

const CodingLab = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [solvedProblemIds] = useState(() => loadSolvedProblemIds());

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((problem) => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        problem.title.toLowerCase().includes(query) ||
        problem.tags.join(' ').toLowerCase().includes(query);

      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [difficulty, search]);

  const stats = useMemo(() => {
    return {
      all: PROBLEMS.length,
      easy: PROBLEMS.filter((problem) => problem.difficulty === 'Easy').length,
      medium: PROBLEMS.filter((problem) => problem.difficulty === 'Medium').length,
      hard: PROBLEMS.filter((problem) => problem.difficulty === 'Hard').length,
    };
  }, []);

  const solvedProblems = useMemo(
    () => PROBLEMS.filter((problem) => solvedProblemIds.includes(problem.id)),
    [solvedProblemIds],
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-500/20"
        />
        <motion.div
          animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20"
        />
      </div>

      <div className="relative mx-auto max-w-[1760px] p-4 lg:p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/60 bg-white/75 px-4 py-3 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Coding Practice Arena</p>
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
              <strong>Problem Explorer:</strong> practice real interview-style coding challenges
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft size={14} /> Back to Chat
          </button>
        </header>

        <section className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-brand-500 to-indigo-600 p-4 text-white shadow-soft md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wide text-white/80">Coding Track</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight">Interview Mode</h2>
            <p className="mt-1 text-sm text-white/85">
              Pick a challenge, solve with your preferred language, and practice structured problem-solving.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Total Problems</p>
            <p className="mt-1 text-2xl font-extrabold">{stats.all}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Visible</p>
            <p className="mt-1 text-2xl font-extrabold">{filteredProblems.length}</p>
          </div>
        </section>

        <section className="mb-4 rounded-3xl border border-white/60 bg-white/75 p-4 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-extrabold tracking-wide">Solved Problems</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {solvedProblems.length} solved
            </p>
          </div>

          {!solvedProblems.length ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              No solved problems yet. Open a challenge and click <strong>Mark as Solved</strong> after completing it.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {solvedProblems.map((problem) => (
                <button
                  key={problem.id}
                  type="button"
                  onClick={() => navigate(`/coding/${problem.id}`)}
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                >
                  {problem.title}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="mb-4 rounded-3xl border border-white/60 bg-white/75 p-4 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-sm font-bold tracking-wide">
              <Sparkles size={15} className="text-brand-600" /> Problem Difficulty Filter
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {filteredProblems.length} / {stats.all} visible
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: `All (${stats.all})`, value: 'All' },
              { label: `Easy (${stats.easy})`, value: 'Easy' },
              { label: `Medium (${stats.medium})`, value: 'Medium' },
              { label: `Hard (${stats.hard})`, value: 'Hard' },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setDifficulty(item.value)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                  difficulty === item.value
                    ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-4 grid grid-cols-1 gap-3 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60 md:grid-cols-3">
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Search Problems</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
              <Search size={15} className="text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or tag"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Current level: <span className="font-bold text-brand-700 dark:text-brand-200">{difficulty}</span>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {!filteredProblems.length ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center dark:border-slate-700 dark:bg-slate-900/60">
              <p className="text-lg font-extrabold">No problems found</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try a different keyword or switch back to the <strong>All</strong> difficulty filter.
              </p>
            </div>
          ) : null}

          {filteredProblems.map((problem) => (
            <motion.button
              key={problem.id}
              type="button"
              onClick={() => navigate(`/coding/${problem.id}`)}
              whileHover={{ y: -4 }}
              className="group lift-on-hover rounded-3xl border border-white/60 bg-white/90 p-5 text-left shadow-soft transition hover:shadow-lg dark:border-slate-800/80 dark:bg-slate-900/70"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
                  <Code2 size={12} /> Problem
                </span>
                <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${difficultyStyles[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              </div>

              <h3 className="text-lg font-extrabold tracking-tight">{problem.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{problem.description}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700 dark:text-brand-300">
                Solve Problem <ChevronRight size={15} />
              </div>

              <div className="mt-3 h-1 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-1 w-0 rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </div>
            </motion.button>
          ))}
        </section>
      </div>
    </main>
  );
};

export default CodingLab;
