// utils/streamStorage.ts
const STREAM_TOKEN_KEY = "stream_token";

export const streamTokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(STREAM_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  set(token: string): void {
    localStorage.setItem(STREAM_TOKEN_KEY, token);
  },

  clear(): void {
    localStorage.removeItem(STREAM_TOKEN_KEY);
  },
};
