import { useState } from 'react';
import { FileUp, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { uploadStudyMaterial } from '../services/api';

const FileUploadPanel = ({ subject }) => {
  const [topic, setTopic] = useState('general');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (file) => {
    if (!file || isUploading) return;

    setIsUploading(true);
    setProgress(0);
    setMessage('');

    try {
      const response = await uploadStudyMaterial({
        file,
        subject,
        topic,
        onProgress: setProgress,
      });

      setMessage(`Indexed ${response.totalChunks} chunks from ${response.fileName}`);
    } catch (error) {
      setMessage(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.02 }}
      className="lift-on-hover rounded-3xl border border-white/60 bg-white/75 p-4 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70"
    >
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <FileUp size={16} /> Upload Notes
      </div>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        Add study material for <strong>{subject.toUpperCase()}</strong> to improve answer quality.
      </p>

      <input
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
        placeholder="Topic (e.g. deadlock)"
        className="mb-3 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-950"
      />

      <motion.label
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white px-4 py-7 text-center text-sm text-slate-600 transition hover:border-brand-300 hover:bg-brand-50/60 dark:border-slate-700 dark:from-slate-950 dark:to-slate-900 dark:text-slate-300 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/10"
      >
        <span className="font-medium">Drag & drop or click to upload PDF/TXT/MD</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Max size follows backend limit settings</span>
        <input
          type="file"
          accept=".pdf,.txt,.md"
          className="hidden"
          onChange={(event) => handleFileUpload(event.target.files?.[0])}
        />
      </motion.label>

      {isUploading ? (
        <div className="mt-3 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <LoaderCircle size={14} className="animate-spin" /> Uploading...
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25 }}
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500"
            />
          </div>
        </div>
      ) : null}

      {message ? <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{message}</p> : null}
    </motion.div>
  );
};

export default FileUploadPanel;
