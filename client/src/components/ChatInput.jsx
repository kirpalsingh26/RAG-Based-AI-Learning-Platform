import { useEffect, useMemo, useState } from 'react';
import { Mic, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  null;

const QUICK_PROMPTS = [
  'Explain this topic in simple language',
  'Give a real-world example',
  'Explain step-by-step for exam prep',
  'Summarize key formulas and definitions',
];

const ChatInput = ({ onSubmit, disabled }) => {
  const [value, setValue] = useState('');
  const [isListening, setIsListening] = useState(false);

  const recognition = useMemo(() => {
    if (!SpeechRecognition) return null;

    const instance = new SpeechRecognition();
    instance.lang = 'en-US';
    instance.continuous = false;
    instance.interimResults = false;
    return instance;
  }, []);

  useEffect(() => {
    if (!recognition) return undefined;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setValue((prev) => `${prev} ${transcript}`.trim());
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    return () => {
      recognition.stop();
    };
  }, [recognition]);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
    setValue('');
  };

  const handleVoice = () => {
    if (!recognition || isListening) return;
    setIsListening(true);
    recognition.start();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.04 }}
      className="rounded-3xl border border-white/60 bg-white/75 p-3 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70"
    >
      <div className="mb-2 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setValue((previousValue) => (previousValue ? `${previousValue} ${prompt}` : prompt))}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10 dark:hover:text-brand-200"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-2">
        <textarea
          rows={2}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask a concept, request examples, or step-by-step explanation..."
          className="min-h-16 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-brand-500 transition focus:-translate-y-0.5 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
        />

        <button
          type="button"
          onClick={handleVoice}
          disabled={!recognition || isListening}
          className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Mic size={16} className={isListening ? 'animate-pulse text-brand-600' : ''} />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled}
          className="animate-pulse-glow rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 p-2.5 text-white transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
        >
          <Send size={16} />
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
        <span>Press Enter to send • Shift+Enter for new line</span>
        <span>{value.length}/1000</span>
      </div>
    </motion.div>
  );
};

export default ChatInput;
