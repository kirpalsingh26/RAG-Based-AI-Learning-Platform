import { Code2, Eraser, MessageCircle, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useChat } from '../context/ChatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const {
    sessions,
    activeSession,
    selectSession,
    createNewChat,
    clearActiveChat,
    deleteSession,
    subjects,
    updateSubject,
  } = useChat();

  return (
    <aside className="flex h-full w-full flex-col p-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="mb-4 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-3 dark:border-brand-500/30 dark:from-brand-500/10 dark:to-slate-900"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-200">Workspace</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Manage subjects and switch between study sessions.</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.03 }}
        type="button"
        onClick={() => createNewChat(activeSession?.subject)}
        className="mb-4 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
      >
        <PlusCircle size={16} /> New Chat
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.06 }}
        type="button"
        onClick={clearActiveChat}
        className="mb-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <Eraser size={16} /> Clear Chat
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.09 }}
        type="button"
        onClick={() => navigate('/coding')}
        className="mb-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:brightness-95 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200"
      >
        <Code2 size={16} /> Coding Practice
      </motion.button>

      <label className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Subject</label>
      <select
        value={activeSession?.subject || 'java'}
        onChange={(event) => updateSubject(event.target.value)}
        className="mb-4 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-brand-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900"
      >
        {subjects.map((subject) => (
          <option key={subject} value={subject}>
            {subject.toUpperCase()}
          </option>
        ))}
      </select>

      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Conversations</p>
      <div className="space-y-2 overflow-auto pr-1">
        {sessions.map((session) => (
          <motion.div
            key={session.id}
            whileHover={{ x: 2, scale: 1.01 }}
            className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm transition ${
              activeSession?.id === session.id
                ? 'border border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-100'
                : 'border border-transparent text-slate-600 hover:border-slate-200 hover:bg-white dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/60'
            }`}
          >
            <button
              type="button"
              onClick={() => selectSession(session.id)}
              className="inline-flex min-w-0 flex-1 items-center gap-2"
            >
              <MessageCircle size={15} />
              <span className="truncate">{session.title || 'Untitled Chat'}</span>
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                deleteSession(session.id);
              }}
              className="ml-auto rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              aria-label="Delete conversation"
              title="Delete conversation"
            >
              <Trash2 size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
