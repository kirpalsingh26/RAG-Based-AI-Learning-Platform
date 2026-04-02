import { useEffect, useState } from 'react';
import { BookOpenText, Database, LogOut, MessageSquareText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import ChatInput from './components/ChatInput';
import ChatWindow from './components/ChatWindow';
import FileUploadPanel from './components/FileUploadPanel';
import CodingLab from './components/CodingLab';
import CodingProblemPage from './components/CodingProblemPage';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import QuizPanel from './components/QuizPanel';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import { useChat } from './context/ChatContext';

const AUTH_STORAGE_KEY = 'ta-auth-v1';

const App = () => {
  const { activeSession, ask, isAsking, subjects } = useChat();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem('ui-theme') || 'light');
  const [showLogin, setShowLogin] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(AUTH_STORAGE_KEY) === '1');
  const messageCount = activeSession.messages.length;
  const sourceCount = activeSession.messages.reduce(
    (count, message) => count + (message.metadata?.context?.length || 0),
    0,
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('ui-theme', theme);
  }, [theme]);

  const handleLogin = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, '1');
    setIsAuthenticated(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          theme={theme}
          onToggleTheme={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
          onOpenLogin={() => {
            setAuthMode('login');
            setShowLogin(true);
          }}
          onOpenRegister={() => {
            setAuthMode('register');
            setShowLogin(true);
          }}
        />
        <LoginModal
          open={showLogin}
          initialMode={authMode}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      </>
    );
  }

  const chatDashboard = (
    <main className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-slate-100 text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-36 top-0 h-72 w-72 rounded-full bg-brand-400/25 blur-3xl dark:bg-brand-500/20"
        />
        <motion.div
          animate={{ x: [0, -24, 0], y: [0, 16, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/20"
        />
        <motion.div
          animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-500/10"
        />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1760px] grid-cols-12 gap-4 p-4 lg:h-screen lg:min-h-0 lg:gap-5 lg:p-6">
        <motion.section
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="col-span-12 rounded-3xl border border-white/60 bg-white/70 shadow-soft backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-900/60 md:col-span-3 lg:h-full lg:col-span-2"
        >
          <Sidebar />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="col-span-12 flex min-h-[70vh] flex-col gap-4 md:col-span-9 lg:h-full lg:min-h-0 lg:col-span-7"
        >
          <header className="rounded-3xl border border-white/60 bg-white/75 px-4 py-4 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-[220px]">
                <p className="mb-1 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
                  <BookOpenText size={13} /> AI Learning Companion
                </p>
                <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Professional RAG Teaching Assistant</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Structured explanations, source-grounded context, and quiz-ready learning.
                </p>
              </div>

              <ThemeToggle
                theme={theme}
                onToggle={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))}
              />

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 dark:border-slate-700/70 dark:bg-slate-800/60">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Total messages</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold">
                  <MessageSquareText size={14} className="text-brand-600" /> {messageCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 dark:border-slate-700/70 dark:bg-slate-800/60">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Retrieved sources</p>
                <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold">
                  <Database size={14} className="text-brand-600" /> {sourceCount}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 dark:border-slate-700/70 dark:bg-slate-800/60 sm:col-span-2 xl:col-span-1">
                <p className="text-[11px] uppercase tracking-wide text-slate-500">Session title</p>
                <p className="mt-1 truncate text-sm font-semibold">{activeSession.title}</p>
              </div>
            </div>
          </header>

          <ChatWindow messages={activeSession.messages} />
          <ChatInput onSubmit={ask} disabled={isAsking} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="col-span-12 space-y-4 md:col-span-12 lg:h-full lg:overflow-auto lg:col-span-3"
        >
          <FileUploadPanel subject={activeSession.subject} />
          <QuizPanel subject={activeSession.subject} subjects={subjects} />
        </motion.section>
      </div>
    </main>
  );

  return (
    <Routes>
      <Route path="/" element={chatDashboard} />
      <Route path="/coding" element={<CodingLab />} />
      <Route path="/coding/:problemId" element={<CodingProblemPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
