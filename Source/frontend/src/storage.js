const KEY = 'toy-shelf-session';

export function loadSession() {
  const value = localStorage.getItem(KEY);
  return value ? JSON.parse(value) : null;
}

export function saveSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

