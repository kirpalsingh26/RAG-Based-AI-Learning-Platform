import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, UserRound, X } from 'lucide-react';

const LoginModal = ({ open, onClose, onLogin, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const isRegister = mode === 'register';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setMode(initialMode);
    setError('');
  }, [open, initialMode]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegister && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }

    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isRegister && password.trim() !== confirmPassword.trim()) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    onLogin({
      name: name.trim(),
      email: email.trim(),
      mode,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-xl rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft dark:border-slate-700/80 dark:bg-slate-900/90"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              {isRegister ? 'Create your study account' : 'Welcome to your AI Study Workspace'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRegister
                ? 'Register to save sessions, track progress, and continue learning.'
                : 'Sign in to continue with your saved sessions and smart learning tools.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <X size={15} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              !isRegister
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              isRegister
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          {isRegister ? (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Full Name</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition focus-within:-translate-y-0.5 focus-within:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-brand-500/40">
                <UserRound size={15} className="text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Email</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition focus-within:-translate-y-0.5 focus-within:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-brand-500/40">
              <Mail size={15} className="text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Password</span>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition focus-within:-translate-y-0.5 focus-within:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-brand-500/40">
              <Lock size={15} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </label>

          {isRegister ? (
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Confirm Password</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 transition focus-within:-translate-y-0.5 focus-within:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-brand-500/40">
                <Lock size={15} className="text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>
          ) : null}

          {error ? <p className="text-xs text-red-500">{error}</p> : null}

          <button
            type="submit"
            className="lift-on-hover w-full rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            {isRegister ? 'Create Account' : 'Continue to Dashboard'}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <button
            type="button"
            onClick={() => setMode((currentMode) => (currentMode === 'register' ? 'login' : 'register'))}
            className="font-semibold text-brand-600 hover:underline dark:text-brand-300"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;
