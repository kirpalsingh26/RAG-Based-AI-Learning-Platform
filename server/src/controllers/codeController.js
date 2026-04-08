const languageConfig = {
  javascript: { languageId: 63 },
  python: { languageId: 71 },
  java: { languageId: 62 },
  cpp: { languageId: 54 },
};

const JUDGE0_ENDPOINT = 'https://ce.judge0.com/submissions?base64_encoded=false';
const JUDGE0_POLL_INTERVAL_MS = 700;
const JUDGE0_MAX_POLL_ATTEMPTS = 18;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchSubmissionResult = async (token) => {
  const resultUrl = `https://ce.judge0.com/submissions/${token}?base64_encoded=false`;

  for (let attempt = 0; attempt < JUDGE0_MAX_POLL_ATTEMPTS; attempt += 1) {
    const response = await fetch(resultUrl);
    const data = await response.json();

    if (!response.ok) {
      const message = data?.message || 'Code execution failed while fetching result.';
      throw new Error(message);
    }

    const statusId = data?.status?.id;
    const isDone = typeof statusId === 'number' ? statusId > 2 : true;
    if (isDone) {
      return data;
    }

    await sleep(JUDGE0_POLL_INTERVAL_MS);
  }

  return {
    stdout: '',
    stderr: '',
    compile_output: '',
    message: 'Execution timed out while waiting for runtime result. Please try again.',
    status: {
      id: 5,
      description: 'Time Limit Exceeded',
    },
  };
};

export const runCode = async (req, res, next) => {
  try {
    const { language, sourceCode, stdin = '' } = req.body;

    const runtime = languageConfig[language];
    if (!runtime) {
      res.status(400);
      throw new Error('Unsupported language.');
    }

    const response = await fetch(JUDGE0_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language_id: runtime.languageId,
        source_code: sourceCode,
        stdin,
      }),
    });

    const submission = await response.json();

    if (!response.ok) {
      const message = submission?.message || 'Code execution failed.';
      res.status(502);
      throw new Error(message);
    }

    const token = submission?.token;
    if (!token) {
      res.status(502);
      throw new Error('Code execution failed: missing submission token.');
    }

    const data = await fetchSubmissionResult(token);

    const statusId = data?.status?.id;
    const statusDescription = data?.status?.description || 'Unknown';
    const stderr = data?.stderr || '';
    const compileOutput = data?.compile_output || '';
    const signal = data?.message || '';
    const output = data?.stdout || '';

    res.status(200).json({
      output,
      stdout: output,
      stderr,
      compileOutput,
      code: typeof statusId === 'number' ? statusId : 0,
      signal,
      status: statusDescription,
    });
  } catch (error) {
    next(error);
  }
};
