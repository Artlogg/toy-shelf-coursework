const API_URL = 'http://localhost:3000';

export async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload?.details === 'string'
        ? payload.details
        : Array.isArray(payload?.details?.message)
          ? payload.details.message.join(', ')
          : 'Ошибка запроса';
    throw new Error(message);
  }

  return payload;
}

