import OpenAI from 'openai';

const LOCAL_EMBEDDING_DIMENSIONS = 768;

const getProvider = () => String(process.env.AI_PROVIDER || 'groq').toLowerCase();

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);

const hashToken = (token, dimensions) => {
  let hash = 0;
  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) % dimensions;
  }
  return Math.abs(hash);
};

const createLocalEmbedding = (inputText, dimensions = LOCAL_EMBEDDING_DIMENSIONS) => {
  const vector = new Array(dimensions).fill(0);
  const tokens = tokenize(inputText);

  if (!tokens.length) return vector;

  for (const token of tokens) {
    const primaryIndex = hashToken(token, dimensions);
    const secondaryIndex = (primaryIndex * 17 + token.length) % dimensions;

    vector[primaryIndex] += 1;
    vector[secondaryIndex] += 0.5;
  }

  const magnitude = Math.sqrt(vector.reduce((acc, value) => acc + value * value, 0));
  if (!magnitude) return vector;

  return vector.map((value) => value / magnitude);
};

const isRecoverableProviderError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  return (
    message.includes('api key') ||
    message.includes('unauthorized') ||
    message.includes('permission') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('timed out') ||
    message.includes('network') ||
    message.includes('reported as leaked')
  );
};

const buildFallbackTeachingResponse = ({ context, question, subject, providerError }) => {
  const providerErrorText = String(providerError || '').toLowerCase();
  const isGroqError = providerErrorText.includes('groq');

  if (providerErrorText.includes('groq_api_key is missing')) {
    return 'Groq is selected but GROQ_API_KEY is missing. Add a valid key in server/.env and retry.';
  }

  if (
    providerErrorText.includes('api key not valid') ||
    providerErrorText.includes('api_key_invalid') ||
    providerErrorText.includes('incorrect api key')
  ) {
    if (isGroqError || providerErrorText.includes('groq_api_key')) {
      return 'Groq API key is invalid. Update GROQ_API_KEY in server/.env with a valid key from Groq Console, then retry your question.';
    }

    return 'Gemini API key is invalid. Update GEMINI_API_KEY in server/.env with a valid key from Google AI Studio, then retry your question.';
  }

  if (
    providerErrorText.includes('quota') ||
    providerErrorText.includes('resource_exhausted') ||
    providerErrorText.includes('rate limit')
  ) {
    if (isGroqError) {
      return 'Groq API quota or rate limit is exceeded. Check your Groq account limits, then retry your question.';
    }

    return 'Gemini API quota is exhausted for your project. Enable billing or wait for quota reset in Google AI Studio, then retry your question.';
  }

  const questionTokens = new Set(tokenize(question));
  const candidateLines = String(context || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('[Chunk '));

  const scoredLines = candidateLines
    .map((line) => {
      const lineTokens = tokenize(line);
      const overlap = lineTokens.reduce((acc, token) => acc + (questionTokens.has(token) ? 1 : 0), 0);
      return {
        line,
        score: overlap,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.line);

  if (!scoredLines.length) {
    return 'I could not generate an AI answer right now, and no matching context was found in your uploaded notes.';
  }

  return [
    `Subject: ${subject || 'general'}`,
    'AI provider is temporarily unavailable, so here is a context-based answer from your uploaded material:',
    ...scoredLines.map((line, index) => `${index + 1}. ${line}`),
  ].join('\n');
};

const buildFallbackQuiz = ({ context, numberOfQuestions = 5 }) => {
  const lines = String(context || '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('[Chunk '));

  const uniqueLines = [...new Set(lines)].slice(0, numberOfQuestions);

  return uniqueLines.map((line, index) => ({
    question: `From the study material, which statement is correct? (${index + 1})`,
    options: [line, 'None of the above', 'Cannot be determined', 'Both A and B'],
    answer: line,
    explanation: 'This statement appears directly in the provided study material.',
  }));
};

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing. Add it in your .env file or switch AI_PROVIDER to gemini.');
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is missing. Add it in your .env file or switch AI_PROVIDER to gemini/openai.');
  }

  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
};

const callGroqChat = async ({ model, systemPrompt, userPrompt, temperature = 0.3 }) => {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model,
    temperature,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  return completion?.choices?.[0]?.message?.content?.trim() || '';
};

const callGemini = async ({ model, task, payload }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Add it in your .env file or switch AI_PROVIDER to openai.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${task}?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.error?.message || 'Gemini API request failed';
    throw new Error(message);
  }

  return data;
};

const extractGeminiText = (data) =>
  data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim() || '';

const buildTeachingSystemPrompt = ({ hasContext }) => {
  if (hasContext) {
    return [
      'You are an expert AI teaching assistant.',
      'Use the provided study context as your primary source.',
      'If the context is incomplete, you may use your own reliable general knowledge to complete the answer.',
      'When you add information beyond the context, explicitly label that section as "General knowledge".',
      'ALWAYS return a well-structured answer (never one long paragraph).',
      'Use this exact format with clear markdown headings and bullets:',
      '### Summary\n- 2 to 4 short bullets',
      '### Key Points\n- concise bullet points',
      '### Steps / Reasoning\n1. numbered steps when applicable',
      '### Example\n- give one practical example',
      '### Final Takeaway\n- one-line revision note',
      'Keep sentences short and easy to scan.',
      'Do not say you cannot answer unless the question is truly unclear.',
    ].join(' ');
  }

  return [
    'You are an expert AI teaching assistant.',
    'No study context is available right now.',
    'Answer the question using your own reliable general knowledge in a clear and practical way.',
    'ALWAYS return a structured response with headings and bullet points (not a long paragraph).',
    'Use sections: Summary, Key Points, Steps/Reasoning, Example, Final Takeaway.',
  ].join(' ');
};

export const createEmbedding = async (inputText) => {
  const provider = getProvider();

  try {
    if (provider === 'groq') {
      return createLocalEmbedding(inputText);
    }

    if (provider === 'gemini') {
      const model = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004';

      const data = await callGemini({
        model,
        task: 'embedContent',
        payload: {
          content: {
            parts: [{ text: inputText }],
          },
        },
      });

      return data?.embedding?.values || [];
    }

    const openai = getOpenAIClient();
    const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

    const response = await openai.embeddings.create({
      model,
      input: inputText,
    });

    return response.data?.[0]?.embedding || [];
  } catch (error) {
    if (!isRecoverableProviderError(error)) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.warn('Falling back to local embeddings:', error.message);
    return createLocalEmbedding(inputText);
  }
};

export const generateTeachingResponse = async ({ context, question, subject }) => {
  const provider = getProvider();
  const hasContext = Boolean(String(context || '').trim());
  const systemPrompt = buildTeachingSystemPrompt({ hasContext });

  try {
    if (provider === 'groq') {
      const model = process.env.GROQ_CHAT_MODEL || 'llama-3.3-70b-versatile';
      const text = await callGroqChat({
        model,
        systemPrompt,
        userPrompt: `Subject: ${subject || 'general'}\n\nContext:\n${context || 'No uploaded context available.'}\n\nQuestion:\n${question}`,
      });

      return text || 'I could not generate an answer at this time.';
    }

    if (provider === 'gemini') {
      const model = process.env.GEMINI_CHAT_MODEL || 'gemini-2.0-flash';

      const data = await callGemini({
        model,
        task: 'generateContent',
        payload: {
          systemInstruction: {
            parts: [
              {
                text: systemPrompt,
              },
            ],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Subject: ${subject || 'general'}\n\nContext:\n${context || 'No uploaded context available.'}\n\nQuestion:\n${question}`,
                },
              ],
            },
          ],
        },
      });

      return extractGeminiText(data) || 'I could not generate an answer at this time.';
    }

    const openai = getOpenAIClient();
    const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';

    const response = await openai.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Subject: ${subject || 'general'}\n\nContext:\n${context || 'No uploaded context available.'}\n\nQuestion:\n${question}`,
        },
      ],
    });

    return response.output_text || 'I could not generate an answer at this time.';
  } catch (error) {
    if (!isRecoverableProviderError(error)) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.warn('Falling back to context-only answer:', error.message);
    return buildFallbackTeachingResponse({
      context,
      question,
      subject,
      providerError: error.message,
    });
  }
};

export const generateQuiz = ({ context, subject, numberOfQuestions = 5, variantSeed = '', useGeneralKnowledge = false }) => {
  return generateQuizInternal({ context, subject, numberOfQuestions, variantSeed, useGeneralKnowledge });
};

const generateQuizInternal = async ({ context, subject, numberOfQuestions = 5, variantSeed = '', useGeneralKnowledge = false }) => {
  const provider = getProvider();
  let rawText = '[]';
  const hasContext = Boolean(String(context || '').trim());
  const quizInstruction = [
    'You are a teaching assistant.',
    hasContext && !useGeneralKnowledge
      ? 'Generate concise MCQ quizzes from provided material only.'
      : 'No study notes are available; generate concise MCQ quizzes using reliable general knowledge for the requested subject.',
    'Strict scope rule: if subject is a specific subject, questions must stay within that subject only.',
    'Only when subject is explicitly "all-subject mix", allow mixed-subject questions.',
    'Return pure JSON array only with keys: question, options, answer, explanation.',
    'Rules:',
    '- Exactly 4 options per question.',
    '- Keep answer equal to one of the options exactly.',
    '- Avoid repeating same question idea.',
    '- Ensure options are plausible and distinct.',
    '- Do not include markdown fences.',
  ].join(' ');

  try {
    if (provider === 'groq') {
      const model = process.env.GROQ_CHAT_MODEL || 'llama-3.3-70b-versatile';
      rawText =
        (await callGroqChat({
          model,
          systemPrompt: quizInstruction,
          userPrompt: `Subject: ${subject || 'general'}\nVariation seed: ${variantSeed || 'default'}\nGenerate ${numberOfQuestions} quiz questions.${hasContext ? `\nUse this context:\n${context}` : ''}`,
          temperature: 0.2,
        })) || '[]';
    } else if (provider === 'gemini') {
      const model = process.env.GEMINI_CHAT_MODEL || 'gemini-2.0-flash';

      const data = await callGemini({
        model,
        task: 'generateContent',
        payload: {
          systemInstruction: {
            parts: [
              {
                text: quizInstruction,
              },
            ],
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Subject: ${subject || 'general'}\nVariation seed: ${variantSeed || 'default'}\nGenerate ${numberOfQuestions} quiz questions.${hasContext ? `\nUse this context:\n${context}` : ''}`,
                },
              ],
            },
          ],
        },
      });

      rawText = extractGeminiText(data) || '[]';
    } else {
      const openai = getOpenAIClient();
      const model = process.env.OPENAI_CHAT_MODEL || 'gpt-4o-mini';

      const response = await openai.responses.create({
        model,
        input: [
          {
            role: 'system',
            content: quizInstruction,
          },
          {
            role: 'user',
            content: `Subject: ${subject || 'general'}\nVariation seed: ${variantSeed || 'default'}\nGenerate ${numberOfQuestions} quiz questions.${hasContext ? `\nUse this context:\n${context}` : ''}`,
          },
        ],
      });

      rawText = response.output_text || '[]';
    }
  } catch (error) {
    if (!isRecoverableProviderError(error)) {
      throw error;
    }

    // eslint-disable-next-line no-console
    console.warn('Falling back to context-only quiz:', error.message);
    return hasContext ? buildFallbackQuiz({ context, numberOfQuestions }) : [];
  }

  rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  try {
    const parsed = JSON.parse(rawText);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        question: String(item?.question || '').trim(),
        options: Array.isArray(item?.options) ? item.options.map((option) => String(option || '').trim()).filter(Boolean).slice(0, 4) : [],
        answer: String(item?.answer || '').trim(),
        explanation: String(item?.explanation || '').trim(),
      }))
      .filter((item) => item.question && item.options.length >= 2);
  } catch {
    return [];
  }
};
