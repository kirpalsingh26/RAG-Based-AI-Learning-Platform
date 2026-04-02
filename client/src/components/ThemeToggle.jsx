import { MoonStar, Sun } from 'lucide-react';

const ThemeToggle = ({ theme, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
  >
    {theme === 'dark' ? <Sun size={16} /> : <MoonStar size={16} />}
    {theme === 'dark' ? 'Light' : 'Dark'}
  </button>
);

export default ThemeToggle;
