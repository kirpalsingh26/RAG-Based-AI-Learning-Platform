import { motion } from 'framer-motion';
import { Check, Copy, Database, Sparkles } from 'lucide-react';
import { useState } from 'react';

import useTypewriter from '../hooks/useTypewriter';
import { highlightKeywords } from '../utils/highlightKeywords';
import { formatTime } from '../utils/time';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const isUser = message.role === 'user';
  const typedContent = useTypewriter(message.content || '', !isUser && !message.typing);
  const displayContent = message.typing ? 'Thinking...' : typedContent;
  const parts = highlightKeywords(displayContent);
  const sources = message.metadata?.context || [];
  const rawConfidence = message.metadata?.confidence;
  const normalizedConfidence = (() => {
    const numeric = Number(rawConfidence);
    if (!Number.isFinite(numeric)) return null;
    if (numeric <= 1) return Math.max(0, Math.min(1, numeric));
    return Math.max(0, Math.min(1, numeric / 100));
  })();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser ? (
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-100">
          <Sparkles size={14} />
        </div>
      ) : null}

      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isUser
            ? 'rounded-br-sm bg-gradient-to-r from-brand-600 to-indigo-600 text-white'
            : 'rounded-bl-sm border border-slate-200/80 bg-white/90 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
        }`}
      >
        <p className="whitespace-pre-wrap">
          {parts.length
            ? parts.map((part, index) =>
                part.type === 'keyword' && !isUser ? (
                  <mark key={`${part.value}-${index}`} className="rounded bg-yellow-200/80 px-0.5 text-slate-800">
                    {part.value}
                  </mark>
                ) : (
                  <span key={`${part.value}-${index}`}>{part.value}</span>
                ),
              )
            : displayContent}
        </p>

        <div className={`mt-1 text-[11px] ${isUser ? 'text-brand-100' : 'text-slate-400'}`}>
          {formatTime(message.createdAt)}
        </div>

        {!isUser && !message.typing ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
            </button>

            {normalizedConfidence !== null ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2 py-1 text-[11px] text-brand-700 dark:border-brand-700/40 dark:bg-brand-500/10 dark:text-brand-100">
                <Sparkles size={12} /> Confidence {(normalizedConfidence * 100).toFixed(0)}%
              </span>
            ) : null}

            {message.metadata?.fromCache ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700 dark:border-emerald-600/40 dark:bg-emerald-500/10 dark:text-emerald-100">
                <Database size={12} /> Cached
              </span>
            ) : null}
          </div>
        ) : null}

        {!isUser && sources.length ? (
          <div className="mt-2 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2 dark:border-slate-700 dark:bg-slate-800/50">
            <button
              type="button"
              onClick={() => setIsSourceOpen((value) => !value)}
              className="text-xs font-medium text-slate-600 dark:text-slate-300"
            >
              {isSourceOpen ? 'Hide sources' : `View sources (${sources.length})`}
            </button>

            {isSourceOpen ? (
              <div className="mt-2 space-y-2">
                {sources.map((source, index) => (
                  <div key={`${source.fileName}-${index}`} className="rounded-xl border border-slate-200 bg-white p-2 text-[11px] dark:border-slate-700 dark:bg-slate-900">
                    <div className="font-semibold text-slate-700 dark:text-slate-200">
                      {source.fileName} • {source.topic}
                    </div>
                    <div className="mt-1 text-slate-500 dark:text-slate-400">
                      Similarity {(source.similarity * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {isUser ? (
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-800 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-800">
          You
        </div>
      ) : null}
    </motion.div>
  );
};

export default MessageBubble;
