const languageConfig = {
  javascript: { languageId: 63 },
  python: { languageId: 71 },
  java: { languageId: 62 },
  cpp: { languageId: 54 },
};

const JUDGE0_ENDPOINT = 'https://ce.judge0.com/submissions/?base64_encoded=false&wait=true';

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

    const data = await response.json();

    if (!response.ok) {
      const message = data?.message || 'Code execution failed.';
      res.status(502);
      throw new Error(message);
    }

    const statusId = data?.status?.id;
    const statusDescription = data?.status?.description || 'Unknown';

    res.status(200).json({
      output: data?.stdout || '',
      stdout: data?.stdout || '',
      stderr: data?.stderr || '',
      compileOutput: data?.compile_output || '',
      code: typeof statusId === 'number' ? statusId : 0,
      signal: data?.message || '',
      status: statusDescription,
    });
  } catch (error) {
    next(error);
  }
};
