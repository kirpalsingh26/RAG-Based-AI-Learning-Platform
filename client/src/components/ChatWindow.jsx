import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import MessageBubble from './MessageBubble';

const ChatWindow = ({ messages }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-0 flex-1 space-y-3 overflow-y-auto rounded-3xl border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/60"
    >
      <div className="sticky top-0 z-10 mb-2 rounded-xl border border-slate-200/70 bg-white/80 px-3 py-1.5 text-[11px] text-slate-500 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/75 dark:text-slate-300">
        Answers are generated from your uploaded notes using retrieval-augmented generation.
      </div>

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {!messages.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
          Start by uploading notes, then ask a question to begin.
        </div>
      ) : null}

      <div ref={endRef} />
    </motion.div>
  );
};

export default ChatWindow;
