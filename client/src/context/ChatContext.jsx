import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { askQuestion } from '../services/api';

const subjects = ['java', 'os', 'dbms', 'cn', 'dsa'];

const createWelcomeMessage = (subject = 'java') => ({
  id: crypto.randomUUID(),
  role: 'assistant',
  content: `Hi! I am your ${subject.toUpperCase()} teaching assistant. Ask me anything from your uploaded notes.`,
  createdAt: new Date().toISOString(),
  typing: false,
});

const createSession = (subject = 'java') => ({
  id: crypto.randomUUID(),
  title: `New ${subject.toUpperCase()} Chat`,
  subject,
  messages: [createWelcomeMessage(subject)],
});

const ChatContext = createContext(null);

const LOCAL_STORAGE_KEY = 'ai_ta_chat_sessions_v1';

const readSessions = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [createSession('java')];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return [createSession('java')];

    return parsed;
  } catch {
    return [createSession('java')];
  }
};

export const ChatProvider = ({ children }) => {
  const [sessions, setSessions] = useState(readSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => readSessions()[0].id);
  const [isAsking, setIsAsking] = useState(false);

  const persist = useCallback((updater) => {
    setSessions((previousSessions) => {
      const nextSessions = typeof updater === 'function' ? updater(previousSessions) : updater;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextSessions));
      return nextSessions;
    });
  }, []);

  const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0];

  const selectSession = (sessionId) => setActiveSessionId(sessionId);

  const createNewChat = useCallback(
    (subject = activeSession?.subject || 'java') => {
      const nextSession = createSession(subject);
      persist((previousSessions) => [nextSession, ...previousSessions]);
      setActiveSessionId(nextSession.id);
    },
    [activeSession?.subject, persist],
  );

  const updateSubject = useCallback(
    (subject) => {
      persist((previousSessions) =>
        previousSessions.map((session) => {
          if (session.id !== activeSession.id) return session;

          if (session.subject === subject) {
            return session;
          }

          return {
            ...session,
            subject,
            title: `New ${subject.toUpperCase()} Chat`,
            messages: [createWelcomeMessage(subject)],
          };
        }),
      );
    },
    [activeSession.id, persist],
  );

  const clearActiveChat = useCallback(() => {
    persist((previousSessions) =>
      previousSessions.map((session) => {
        if (session.id !== activeSession.id) return session;

        return {
          ...session,
          title: `New ${session.subject.toUpperCase()} Chat`,
          messages: [createWelcomeMessage(session.subject)],
        };
      }),
    );
  }, [activeSession.id, persist]);

  const deleteSession = useCallback(
    (sessionId) => {
      let nextActiveSessionId = activeSessionId;

      persist((previousSessions) => {
        let remainingSessions = previousSessions.filter((session) => session.id !== sessionId);

        if (!remainingSessions.length) {
          const fallbackSession = createSession(activeSession?.subject || 'java');
          remainingSessions = [fallbackSession];
          nextActiveSessionId = fallbackSession.id;
        } else if (sessionId === activeSessionId) {
          nextActiveSessionId = remainingSessions[0].id;
        }

        return remainingSessions;
      });

      setActiveSessionId(nextActiveSessionId);
    },
    [activeSession?.subject, activeSessionId, persist],
  );

  const addMessage = useCallback(
    (role, content, extra = {}) => {
      persist((previousSessions) =>
        previousSessions.map((session) => {
          if (session.id !== activeSession.id) return session;

          return {
            ...session,
            title:
              role === 'user' && session.messages.length <= 2
                ? content.slice(0, 30)
                : session.title,
            messages: [
              ...session.messages,
              {
                id: crypto.randomUUID(),
                role,
                content,
                createdAt: new Date().toISOString(),
                ...extra,
              },
            ],
          };
        }),
      );
    },
    [activeSession.id, persist],
  );

  const getLastTypingMessageIndex = (messages) => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index]?.typing) return index;
    }

    return -1;
  };

  const ask = useCallback(
    async (question) => {
      if (!question.trim() || isAsking) return;

      addMessage('user', question.trim());
      addMessage('assistant', '', { typing: true });
      setIsAsking(true);

      try {
        const response = await askQuestion({
          question,
          subject: activeSession.subject,
        });

        persist((previousSessions) =>
          previousSessions.map((session) => {
            if (session.id !== activeSession.id) return session;

            const nextMessages = [...session.messages];
            const targetIndex = getLastTypingMessageIndex(nextMessages);

            if (targetIndex >= 0) {
              nextMessages[targetIndex] = {
                ...nextMessages[targetIndex],
                content: response.answer,
                typing: false,
                metadata: {
                  fromCache: response.fromCache,
                  confidence: Number(response.confidence),
                  context: response.retrievedContext,
                },
              };
            }

            return {
              ...session,
              messages: nextMessages,
            };
          }),
        );
      } catch (error) {
        persist((previousSessions) =>
          previousSessions.map((session) => {
            if (session.id !== activeSession.id) return session;

            const nextMessages = [...session.messages];
            const targetIndex = getLastTypingMessageIndex(nextMessages);

            if (targetIndex >= 0) {
              nextMessages[targetIndex] = {
                ...nextMessages[targetIndex],
                content: error.message || 'Request failed',
                typing: false,
              };
            }

            return {
              ...session,
              messages: nextMessages,
            };
          }),
        );
      } finally {
        setIsAsking(false);
      }
    },
    [activeSession.id, activeSession.subject, addMessage, isAsking, persist],
  );

  const value = useMemo(
    () => ({
      subjects,
      sessions,
      activeSession,
      isAsking,
      selectSession,
      createNewChat,
      clearActiveChat,
      deleteSession,
      updateSubject,
      ask,
    }),
    [
      activeSession,
      ask,
      clearActiveChat,
      createNewChat,
      deleteSession,
      isAsking,
      sessions,
      updateSubject,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }

  return context;
};
