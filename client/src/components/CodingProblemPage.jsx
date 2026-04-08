import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, CheckCircle2, Code2, Lightbulb, LoaderCircle, PlayCircle, RotateCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { LANGUAGES, PROBLEMS } from '../data/codingProblems';
import { PROBLEM_SOLUTIONS } from '../data/problemSolutions';
import { runCode } from '../services/api';

const difficultyStyles = {
  Easy: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30',
  Medium: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30',
  Hard: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30',
};

const SOLVED_PROBLEMS_STORAGE_KEY = 'codingSolvedProblems';
const CODING_DRAFTS_STORAGE_KEY = 'codingDraftsByProblemLanguage';
const SOLVED_CODE_SNAPSHOTS_STORAGE_KEY = 'codingSolvedCodeSnapshots';

const loadStoredMap = (storageKey) => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = JSON.parse(raw || '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const saveStoredMap = (storageKey, value) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(value));
};

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

const saveSolvedProblemIds = (problemIds) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SOLVED_PROBLEMS_STORAGE_KEY, JSON.stringify(problemIds));
};

const getNoOutputHint = (language) => {
  if (language === 'java') {
    return 'Execution finished, but nothing was printed. In Java, print from main() using System.out.println(...).';
  }

  if (language === 'cpp') {
    return 'Execution finished, but nothing was printed. In C++, print from main() using cout << ...;';
  }

  return 'Execution finished, but your code did not print/return any value for the provided input.';
};

const isStarterCodeUnchanged = (language, userCode, activeProblem) => {
  const starter = String(activeProblem?.starterCode?.[language] || '').trim();
  const current = String(userCode || '').trim();
  return Boolean(starter) && starter === current;
};

const hasPlaceholderLogic = (language, userCode) => {
  const code = String(userCode || '');

  if (language === 'javascript') {
    return /\/\/\s*return\s*\[i\s*,\s*j\]/i.test(code)
      || /function\s+solve\s*\([^)]*\)\s*\{\s*(?:\/\/.*)?\s*\}$/s.test(code);
  }

  if (language === 'python') {
    return /def\s+solve\s*\([^)]*\):[\s\S]*\bpass\b/.test(code);
  }

  if (language === 'java') {
    return /return\s+new\s+int\[\]\s*\{\s*\}\s*;/.test(code)
      || /return\s+false\s*;/.test(code)
      || /return\s+-?1\s*;/.test(code);
  }

  if (language === 'cpp') {
    return /return\s*\{\s*\}\s*;/.test(code)
      || /return\s+false\s*;/.test(code)
      || /return\s+-?1\s*;/.test(code);
  }

  return false;
};

const CodingProblemPage = () => {
  const navigate = useNavigate();
  const { problemId } = useParams();

  const activeProblem = useMemo(
    () => PROBLEMS.find((problem) => problem.id === problemId) || PROBLEMS[0],
    [problemId],
  );

  const [activeLanguage, setActiveLanguage] = useState(LANGUAGES[0]);
  const [drafts, setDrafts] = useState(() => loadStoredMap(CODING_DRAFTS_STORAGE_KEY));
  const [feedback, setFeedback] = useState('');
  const [stdin, setStdin] = useState('');
  const [result, setResult] = useState({ output: '', stderr: '', compileOutput: '', status: '', signal: '', executionState: 'neutral' });
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solvedProblemIds, setSolvedProblemIds] = useState(() => loadSolvedProblemIds());
  const [solvedCodeSnapshots, setSolvedCodeSnapshots] = useState(() => loadStoredMap(SOLVED_CODE_SNAPSHOTS_STORAGE_KEY));

  const isDarkTheme =
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const draftKey = `${activeProblem.id}::${activeLanguage}`;
  const currentCode = drafts[draftKey] ?? activeProblem.starterCode[activeLanguage];
  const savedSolvedSnapshot = solvedCodeSnapshots[draftKey];

  const solutionForProblem = PROBLEM_SOLUTIONS[activeProblem.id] || {};
  const selectedHint = solutionForProblem[activeLanguage] || solutionForProblem.javascript;
  const hintData = typeof selectedHint === 'string'
    ? {
        reference: selectedHint,
        improved: selectedHint,
        notes: 'This is already an optimized approach for this problem.',
      }
    : {
        reference: selectedHint?.reference || selectedHint?.improved || '',
        improved: selectedHint?.improved || selectedHint?.reference || '',
        notes: selectedHint?.notes || 'Try to reduce extra work and avoid repeated scans.',
        complexity: selectedHint?.complexity || '',
      };

  const solutionCode = hintData.improved || 'Solution is not available for this problem yet.';
  const isSolved = solvedProblemIds.includes(activeProblem.id);

  useEffect(() => {
    setShowSolution(false);
  }, [activeProblem.id, activeLanguage]);

  useEffect(() => {
    saveSolvedProblemIds(solvedProblemIds);
  }, [solvedProblemIds]);

  useEffect(() => {
    saveStoredMap(CODING_DRAFTS_STORAGE_KEY, drafts);
  }, [drafts]);

  useEffect(() => {
    saveStoredMap(SOLVED_CODE_SNAPSHOTS_STORAGE_KEY, solvedCodeSnapshots);
  }, [solvedCodeSnapshots]);

  const updateCode = (value) => {
    setDrafts((previous) => ({
      ...previous,
      [draftKey]: value,
    }));
  };

  const resetCode = () => {
    setDrafts((previous) => ({
      ...previous,
      [draftKey]: activeProblem.starterCode[activeLanguage],
    }));
    setFeedback('Starter code restored.');
  };

  const toggleHint = () => {
    setShowSolution((previous) => !previous);
    setFeedback('Hint toggled. Compare with the improved solution and update your implementation.');
  };

  const toggleSolvedProblem = () => {
    setSolvedCodeSnapshots((previous) => ({
      ...previous,
      [draftKey]: {
        code: currentCode,
        stdin,
        savedAt: new Date().toISOString(),
      },
    }));

    setSolvedProblemIds((previous) => {
      if (previous.includes(activeProblem.id)) {
        setFeedback('Problem removed from solved list. Your saved solved code is still available.');
        return previous.filter((id) => id !== activeProblem.id);
      }

      setFeedback('Great work! Problem added to solved list and code snapshot saved.');
      return [...previous, activeProblem.id];
    });
  };

  const loadSolvedSnapshot = () => {
    if (!savedSolvedSnapshot?.code) {
      setFeedback('No saved solved code found for this language yet.');
      return;
    }

    setDrafts((previous) => ({
      ...previous,
      [draftKey]: savedSolvedSnapshot.code,
    }));

    if (typeof savedSolvedSnapshot.stdin === 'string') {
      setStdin(savedSolvedSnapshot.stdin);
    }

    setFeedback('Loaded your saved solved code for this problem/language.');
  };

  const monacoLanguage = activeLanguage === 'cpp' ? 'cpp' : activeLanguage;

  const buildExecutableSource = ({ language, sourceCode }) => {
    const raw = String(sourceCode || '');

    if (language === 'javascript' && /\bsolve\s*\(/.test(raw)) {
      return `${raw}

const fs = require('fs');
const __input = fs.readFileSync(0, 'utf8').trim();
let __args = [];
if (__input) {
  try {
    const __parsed = JSON.parse(__input);
    __args = Array.isArray(__parsed) ? __parsed : [__parsed];
  } catch (e) {
    console.log('Invalid JSON input. Provide stdin as JSON. Example: [[ [0,30],[35,50] ]] for intervals-only problems.');
    process.exit(0);
  }
}

if (__args.length === 0) {
  console.log('No input provided. Add stdin JSON. Example: [[[0,30],[35,50]]] or [[2,7,11,15],9] based on problem signature.');
  process.exit(0);
}

const __result = solve(...__args);
if (typeof __result === 'object') {
  console.log(JSON.stringify(__result));
} else {
  console.log(String(__result));
}
`;
    }

    if (language === 'python' && /def\s+solve\s*\(/.test(raw)) {
      return `${raw}

import json
import sys

_input = sys.stdin.read().strip()
_args = []
if _input:
  try:
    _parsed = json.loads(_input)
    _args = _parsed if isinstance(_parsed, list) else [_parsed]
  except Exception:
    print('Invalid JSON input. Provide stdin as JSON. Example: [[[0,30],[35,50]]] for intervals-only problems.')
    sys.exit(0)

if len(_args) == 0:
  print('No input provided. Add stdin JSON. Example: [[[0,30],[35,50]]] or [[2,7,11,15],9] based on problem signature.')
  sys.exit(0)

_result = solve(*_args)
if isinstance(_result, (dict, list, tuple)):
    print(json.dumps(_result))
else:
    print(_result)
`;
    }

    if (language === 'java' && !/class\s+Main\b/.test(raw)) {
      return `${raw}

class Main {
  public static void main(String[] args) {
    System.out.println("Code compiled successfully. Add class Main with input/output logic to run custom tests.");
  }
}
`;
    }

    if (language === 'cpp' && !/int\s+main\s*\(/.test(raw)) {
      return `${raw}

#include <iostream>
int main() {
  std::cout << "Code compiled successfully. Add main() with input/output logic to run custom tests.";
  return 0;
}
`;
    }

    return raw;
  };

  const executeCode = async () => {
    setIsRunning(true);
    setFeedback('Running your code on remote runtime...');
    setResult({ output: '', stderr: '', compileOutput: '', status: '', signal: '', executionState: 'neutral' });

    try {
      const sourceToRun = buildExecutableSource({
        language: activeLanguage,
        sourceCode: currentCode,
      });

      const response = await runCode({
        language: activeLanguage,
        sourceCode: sourceToRun,
        stdin,
      });

      const output = response.output || response.stdout || '';
      const compileOutput = response.compileOutput || response.compile_output || '';
      const stderr = response.stderr || '';
      const status = response.status || '';
      const signal = response.signal || '';
      const nonSuccessStatus = status && !/accepted|success/i.test(status);

      const normalizedError = stderr || (nonSuccessStatus ? `${status}${signal ? `: ${signal}` : ''}` : '');
      const starterUnchanged = isStarterCodeUnchanged(activeLanguage, currentCode, activeProblem);
      const placeholderLogic = hasPlaceholderLogic(activeLanguage, currentCode);

      const outputText = String(output || '').trim();
      const noInputHint = /No input provided\. Add stdin JSON/i.test(outputText);
      const undefinedLikeOutput = /^(undefined|null|none)$/i.test(outputText);

      let executionState = 'success';
      if (normalizedError || compileOutput) {
        executionState = 'error';
      } else if (!outputText || noInputHint || undefinedLikeOutput || starterUnchanged || placeholderLogic) {
        executionState = 'warning';
      }

      setResult({
        output,
        stderr: normalizedError,
        compileOutput,
        status,
        signal,
        executionState,
      });

      if (normalizedError || compileOutput) {
        setFeedback('Execution completed with errors/warnings. Review output below.');
      } else if (!String(output || '').trim()) {
        setResult((previous) => ({
          ...previous,
          output: getNoOutputHint(activeLanguage),
          executionState: 'warning',
        }));
        setFeedback('Execution completed with no printed output. Added guidance in Program Output.');
      } else if (starterUnchanged || placeholderLogic || noInputHint || undefinedLikeOutput) {
        setFeedback('Code executed, but solution looks incomplete. Please write proper logic before marking solved.');
      } else {
        setFeedback('Execution completed successfully.');
      }
    } catch (error) {
      setFeedback(error.message || 'Execution failed.');
      setResult({ output: '', stderr: error.message || 'Execution failed.', compileOutput: '', status: 'Execution failed', signal: '', executionState: 'error' });
    } finally {
      setIsRunning(false);
    }
  };

  const programOutputPanelClass = result.executionState === 'error'
    ? 'mt-3 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs dark:border-rose-500/40 dark:bg-rose-500/10'
    : result.executionState === 'warning'
      ? 'mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs dark:border-amber-500/40 dark:bg-amber-500/10'
    : result.executionState === 'success'
      ? 'mt-3 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs dark:border-emerald-500/40 dark:bg-emerald-500/10'
      : 'mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800/60';

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ x: [0, 16, 0], y: [0, -12, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-400/20 blur-3xl dark:bg-brand-500/20"
        />
        <motion.div
          animate={{ x: [0, -16, 0], y: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/20"
        />
      </div>

      <div className="relative mx-auto max-w-[1760px] p-4 lg:p-6">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/60 bg-white/75 px-4 py-3 shadow-soft backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/70">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Coding Problem</p>
            <h1 className="truncate text-xl font-extrabold tracking-tight lg:text-2xl">{activeProblem.title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${difficultyStyles[activeProblem.difficulty]}`}>
              {activeProblem.difficulty}
            </span>
            <button
              type="button"
              onClick={() => navigate('/coding')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={14} /> All Problems
            </button>
          </div>
        </header>

        <section className="grid grid-cols-12 gap-4 lg:gap-5">
          <div className="col-span-12 space-y-4 lg:col-span-5">
            <div className="lift-on-hover rounded-3xl border border-white/60 bg-white/85 p-5 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/75 lg:sticky lg:top-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {activeProblem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h2 className="text-lg font-extrabold">Problem Statement</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{activeProblem.description}</p>

              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Custom Input (stdin)</p>
                <textarea
                  value={stdin}
                  onChange={(event) => setStdin(event.target.value)}
                  placeholder='Provide runtime input as JSON. Example: [[2,7,11,15],9]'
                  className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-800"
                />
              </div>


              {showSolution ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-brand-200 bg-brand-50/60 dark:border-brand-500/40 dark:bg-brand-500/10">
                  <div className="border-b border-brand-200 px-3 py-2 text-xs font-extrabold uppercase tracking-wide text-brand-700 dark:border-brand-500/40 dark:text-brand-200">
                    Improved Hint Solution ({activeLanguage.toUpperCase()})
                  </div>
                  {hintData.complexity ? (
                    <p className="px-3 pt-2 text-[11px] font-bold text-brand-700 dark:text-brand-200">Complexity: {hintData.complexity}</p>
                  ) : null}
                  <p className="px-3 pt-2 text-[11px] text-slate-700 dark:text-slate-200">{hintData.notes}</p>
                  <pre className="max-h-72 overflow-auto whitespace-pre-wrap p-3 text-xs text-slate-700 dark:text-slate-200">{solutionCode}</pre>
                </div>
              ) : null}
              <div className="mt-4">
                <h3 className="text-sm font-extrabold">Examples</h3>
                <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {activeProblem.examples.map((example) => (
                    <li key={example} className="rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-extrabold">Constraints</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
                  {activeProblem.constraints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="lift-on-hover rounded-3xl border border-white/60 bg-white/85 p-4 shadow-soft dark:border-slate-800/80 dark:bg-slate-900/75">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-sm font-extrabold">
                  <Code2 size={15} className="text-brand-600" /> Code Editor
                </div>

                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => setActiveLanguage(language)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                        activeLanguage === language
                          ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {language.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                <Editor
                  height="520px"
                  language={monacoLanguage}
                  theme={isDarkTheme ? 'vs-dark' : 'vs'}
                  value={currentCode}
                  onChange={(value) => updateCode(value || '')}
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Language: <span className="font-bold text-slate-700 dark:text-slate-200">{activeLanguage.toUpperCase()}</span>
                </p>

                <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleHint}
                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-3 py-2 text-xs font-bold text-white"
                >
                  <Lightbulb size={14} /> {showSolution ? 'Hide Hint' : 'Show Hint'}
                </button>
                <button
                  type="button"
                  onClick={executeCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-70"
                >
                  {isRunning ? <LoaderCircle size={14} className="animate-spin" /> : <PlayCircle size={14} />} Run Code
                </button>
                <button
                  type="button"
                  onClick={resetCode}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900"
                >
                  <span className="inline-flex items-center gap-1"><RotateCcw size={13} /> Reset Code</span>
                </button>
                <button
                  type="button"
                  onClick={toggleSolvedProblem}
                  className={`inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-white ${
                    isSolved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500'
                  }`}
                >
                  <CheckCircle2 size={14} /> {isSolved ? 'Solved' : 'Mark as Solved'}
                </button>
                <button
                  type="button"
                  onClick={loadSolvedSnapshot}
                  disabled={!savedSolvedSnapshot?.code}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"
                >
                  Load Saved Solution
                </button>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                <p className="inline-flex items-center gap-1 font-extrabold">
                  <Lightbulb size={13} /> Smart Feedback
                </p>
                <p className="mt-1">{feedback || 'Focus on optimal logic first, then refine for edge cases and readability.'}</p>
              </div>

              <div className={programOutputPanelClass}>
                <p className="mb-1 font-extrabold text-slate-700 dark:text-slate-200">Program Output</p>
                <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-slate-600 dark:text-slate-300">{result.output || 'No output yet.'}</pre>

                {result.status ? (
                  <p className="mt-2 font-semibold text-slate-600 dark:text-slate-300">
                    Runtime Status: <span className="font-extrabold">{result.status}</span>
                  </p>
                ) : null}

                {result.signal && !result.stderr ? (
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{result.signal}</p>
                ) : null}

                {result.compileOutput ? (
                  <>
                    <p className="mb-1 mt-3 font-extrabold text-amber-700 dark:text-amber-300">Compile Output</p>
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-amber-700 dark:text-amber-200">{result.compileOutput}</pre>
                  </>
                ) : null}

                {result.stderr ? (
                  <>
                    <p className="mb-1 mt-3 font-extrabold text-rose-700 dark:text-rose-300">Errors</p>
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-rose-700 dark:text-rose-200">{result.stderr}</pre>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CodingProblemPage;
