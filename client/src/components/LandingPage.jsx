import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, Brain, CheckCircle2, FlaskConical, Sparkles } from 'lucide-react';

import ThemeToggle from './ThemeToggle';

const features = [
  {
    icon: Brain,
    title: 'AI tutor that explains clearly',
    description: 'Get concept-first explanations, exam-friendly points, and practical examples instantly.',
  },
  {
    icon: BookOpenCheck,
    title: 'RAG from your notes',
    description: 'Upload PDFs/TXT/MD and ask grounded questions using your own study material.',
  },
  {
    icon: FlaskConical,
    title: 'Quick quiz generation',
    description: 'Generate MCQs from your uploaded notes and test understanding in seconds.',
  },
];

const highlights = [
  'Upload notes by topic and subject',
  'Source-aware answers with confidence',
  'Chat history with multi-session workflow',
  'Dark/light mode with polished UI',
  'Fast local development ready',
  'Built for exam revision and concept clarity',
];

const LandingPage = ({ theme, onToggleTheme, onOpenLogin, onOpenRegister }) => {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, -14, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl dark:bg-brand-500/20"
        />
        <motion.div
          animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/20"
        />
        <motion.div
          animate={{ x: [0, 16, 0], y: [0, 10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10"
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-10">
        <header className="sticky top-4 z-20 rounded-2xl border border-white/60 bg-white/75 px-4 py-3 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">AI Study Platform</p>
              <h1 className="text-sm font-semibold sm:text-base">Precision learning with RAG + tutoring intelligence</h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
              <button
                type="button"
                onClick={onOpenRegister}
                className="lift-on-hover rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Register
              </button>
              <button
                type="button"
                onClick={onOpenLogin}
                className="lift-on-hover rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
              >
                Login
              </button>
            </div>
          </div>
        </header>

        <section className="pt-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-10 lg:p-14"
          >
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
              <Sparkles size={13} /> Next-Gen Personalized AI Learning Copilot
            </p>
            <h2 className="max-w-5xl text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Master complex subjects with contextual AI explanations and exam-ready guidance
            </h2>
            <p className="mt-4 max-w-4xl text-sm text-slate-600 dark:text-slate-300 sm:text-base lg:text-lg">
              Ask deep questions, get high-quality structured answers, and build stronger understanding from your own notes.
              Designed for focused study sessions, revision planning, and concept retention.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="lift-on-hover inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110"
              >
                Start Learning <ArrowRight size={15} />
              </button>
              <a
                href="#features"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Explore Features
              </a>
            </div>
          </motion.div>
        </section>

        <section id="features" className="pt-14">
          <h3 className="text-3xl font-bold tracking-tight">Why top students love this workflow</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Professional learning UX optimized for clarity, speed, and outcome.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-3 lg:gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/70"
              >
                <feature.icon className="text-brand-600" size={20} />
                <h4 className="mt-3 text-lg font-semibold">{feature.title}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="pt-14">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8">
            <h3 className="text-3xl font-bold tracking-tight">Built for deep work and long study cycles</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Everything needed for a complete ask → understand → test loop.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-600 p-8 text-white sm:p-10">
            <h3 className="text-3xl font-bold tracking-tight">Ready to unlock a professional AI study experience?</h3>
            <p className="mt-2 text-sm text-white/85">
              Login and start learning with structured answers, source-aware context, and fast quiz generation.
            </p>
            <button
              type="button"
              onClick={onOpenRegister}
              className="mt-5 rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700"
            >
              Create Free Account
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;
