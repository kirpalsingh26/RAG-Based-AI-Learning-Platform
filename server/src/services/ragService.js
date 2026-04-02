import DocumentChunk from '../models/DocumentChunk.js';
import { chunkTextByWords } from '../utils/chunkText.js';
import { cosineSimilarity } from '../utils/cosineSimilarity.js';
import { createEmbedding, generateQuiz, generateTeachingResponse } from './openaiService.js';
import { createCacheKey, getCachedValue, setCachedValue } from './cacheService.js';

const MAX_SIMILARITY_CANDIDATES = 1200;
const TOP_K = 4;
const QUIZ_SOURCE_LIMIT = 80;

const shuffle = (items) => {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

const tokenize = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);

const getKeywordScore = (questionTokens, chunkText) => {
  if (!questionTokens.length) return 0;
  const chunkTokens = new Set(tokenize(chunkText));

  let overlaps = 0;
  for (const token of questionTokens) {
    if (chunkTokens.has(token)) overlaps += 1;
  }

  return overlaps / questionTokens.length;
};

export const indexStudyMaterial = async ({ fileName, text, subject, topic }) => {
  const normalizedSubject = String(subject || 'general').toLowerCase();
  const normalizedTopic = String(topic || 'general').toLowerCase();
  const chunks = chunkTextByWords(text, 360, 60);

  if (!chunks.length) {
    throw new Error('No readable text found in the uploaded file.');
  }

  const embeddingPromises = chunks.map((chunk) => createEmbedding(chunk.text));
  const embeddings = await Promise.all(embeddingPromises);

  await DocumentChunk.deleteMany({
    subject: normalizedSubject,
    fileName,
  });

  const docs = chunks.map((chunk, index) => ({
    subject: normalizedSubject,
    topic: normalizedTopic,
    fileName,
    chunkText: chunk.text,
    chunkIndex: index,
    embedding: embeddings[index],
    metadata: {
      sourceType: 'upload',
      wordCount: chunk.wordCount,
    },
  }));

  await DocumentChunk.insertMany(docs, { ordered: true });

  return {
    totalChunks: docs.length,
    subject: normalizedSubject,
    topic: normalizedTopic,
  };
};

export const askWithRag = async ({ question, subject }) => {
  const normalizedSubject = String(subject || 'general').toLowerCase();
  const normalizedQuestion = String(question || '').trim();

  if (!normalizedQuestion) {
    throw new Error('Question is required.');
  }

  const cacheKey = createCacheKey(normalizedSubject, normalizedQuestion);
  const cached = getCachedValue(cacheKey);

  if (cached) {
    return {
      ...cached,
      fromCache: true,
    };
  }


  const candidateChunks = await DocumentChunk.find({
    subject: normalizedSubject,
  })
    .select('chunkText fileName topic embedding')
    .limit(MAX_SIMILARITY_CANDIDATES)
    .lean();

  if (!candidateChunks.length) {
    const answer = await generateTeachingResponse({
      context: '',
      question: normalizedQuestion,
      subject: normalizedSubject,
    });

    const payload = {
      answer,
      confidence: 0,
      retrievedContext: [],
      fromCache: false,
    };

    setCachedValue(cacheKey, payload);
    return payload;
  }

  const queryEmbedding = await createEmbedding(normalizedQuestion);
  const questionTokens = tokenize(normalizedQuestion);

  const rankedChunks = candidateChunks
    .map((chunk) => ({
      ...chunk,
      semanticSimilarity: cosineSimilarity(queryEmbedding, chunk.embedding),
      keywordScore: getKeywordScore(questionTokens, chunk.chunkText),
    }))
    .map((chunk) => ({
      ...chunk,
      similarity: chunk.semanticSimilarity * 0.82 + chunk.keywordScore * 0.18,
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, TOP_K);

  const context = rankedChunks
    .map(
      (chunk, index) =>
        `[Chunk ${index + 1} | File: ${chunk.fileName} | Topic: ${chunk.topic}]\n${chunk.chunkText}`,
    )
    .join('\n\n');

  const answer = await generateTeachingResponse({
    context,
    question: normalizedQuestion,
    subject: normalizedSubject,
  });

  const payload = {
    answer,
    confidence: rankedChunks.length
      ? Number((rankedChunks.reduce((acc, item) => acc + item.similarity, 0) / rankedChunks.length).toFixed(4))
      : 0,
    retrievedContext: rankedChunks.map((chunk) => ({
      fileName: chunk.fileName,
      topic: chunk.topic,
      similarity: Number(chunk.similarity.toFixed(4)),
      semanticSimilarity: Number(chunk.semanticSimilarity.toFixed(4)),
      keywordScore: Number(chunk.keywordScore.toFixed(4)),
      chunkText: chunk.chunkText,
    })),
    fromCache: false,
  };

  setCachedValue(cacheKey, payload);

  return payload;
};

export const generateQuizFromSubject = async ({ subject, count = 5 }) => {
  const normalizedSubject = String(subject || 'general').toLowerCase();
  const requestedCount = Math.min(10, Math.max(1, Math.floor(Number(count) || 5)));
  const subjectFilter = normalizedSubject === 'all' ? {} : { subject: normalizedSubject };
  const variantSeed = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const chunks = await DocumentChunk.find(subjectFilter)
    .select('chunkText subject topic fileName')
    .limit(QUIZ_SOURCE_LIMIT)
    .lean();

  if (!chunks.length) {
    const quiz = await generateQuiz({
      context: '',
      subject: normalizedSubject === 'all' ? 'all-subject mix' : normalizedSubject,
      numberOfQuestions: requestedCount,
      variantSeed,
      useGeneralKnowledge: true,
    });

    const normalizedQuiz = Array.isArray(quiz) ? quiz : [];

    return shuffle(normalizedQuiz).map((item) => ({
      ...item,
      options: Array.isArray(item?.options) ? shuffle(item.options) : item?.options,
    }));
  }

  const sampledChunks = shuffle(chunks).slice(0, Math.min(chunks.length, 12));

  const context = sampledChunks
    .map(
      (item, index) =>
        `[Source ${index + 1} | Subject: ${item.subject} | Topic: ${item.topic} | File: ${item.fileName}]\n${item.chunkText}`,
    )
    .join('\n\n');

  const quiz = await generateQuiz({
    context,
    subject: normalizedSubject === 'all' ? 'all-subject mix' : normalizedSubject,
    numberOfQuestions: requestedCount,
    variantSeed,
  });

  const normalizedQuiz = Array.isArray(quiz) ? quiz : [];

  return shuffle(normalizedQuiz).map((item) => ({
    ...item,
    options: Array.isArray(item?.options) ? shuffle(item.options) : item?.options,
  }));
};
