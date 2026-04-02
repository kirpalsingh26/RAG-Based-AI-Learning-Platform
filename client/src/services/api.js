const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const parseJson = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};

export const askQuestion = async ({ question, subject }) => {
  const response = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, subject }),
  });

  return parseJson(response);
};

export const uploadStudyMaterial = ({ file, subject, topic, onProgress }) =>
  new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);
    formData.append('topic', topic || 'general');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/upload`);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || typeof onProgress !== 'function') return;
      const percent = Math.round((event.loaded / event.total) * 100);
      onProgress(percent);
    };

    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText || '{}');
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(payload);
          return;
        }

        reject(new Error(payload.message || 'Upload failed'));
      } catch {
        reject(new Error('Failed to parse upload response'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });

export const generateQuiz = async ({ subject, count = 5 }) => {
  const response = await fetch(`${API_BASE}/ask/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subject, count }),
  });

  return parseJson(response);
};

export const runCode = async ({ language, sourceCode, stdin = '' }) => {
  const response = await fetch(`${API_BASE}/code/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ language, sourceCode, stdin }),
  });

  return parseJson(response);
};
