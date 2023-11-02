export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;

async function sendRequest<T>(
  method: string,
  url: string,
  token?: string,
  payload?: unknown,
  contentType?: string,
  skipResponse?: boolean,
): Promise<T | undefined> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': contentType || 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  });

  if (skipResponse) {
    return undefined;
  }

  if (response.status >= 200 && response.status < 300) {
    const data = await response.json();
    return data;
  }

  throw new Error(response.status.toString());
}

export async function sendPostRequest<T>(
  url: string,
  token?: string,
  payload?: object,
  contentType?: string,
): Promise<T> {
  const response = await sendRequest<T>('POST', url, token, payload, contentType);
  return response as T;
}

export async function sendPutRequest<T>(
  url: string,
  token?: string,
  payload?: unknown,
  contentType?: string,
  skipResponse?: boolean,
): Promise<T> {
  const response = await sendRequest<T>('PUT', url, token, payload, contentType, skipResponse);
  return response as T;
}

export async function sendPatchRequest<T>(
  url: string,
  token?: string,
  payload?: unknown,
  contentType?: string,
  skipResponse?: boolean,
): Promise<T> {
  const response = await sendRequest<T>('PATCH', url, token, payload, contentType, skipResponse);
  return response as T;
}

export async function sendGetRequest<T>(
  url: string,
  token?: string,
  contentType?: string,
): Promise<T> {
  const response = await sendRequest<T>('GET', url, token, undefined, contentType);
  return response as T;
}

export async function sendDeleteRequest<T>(
  url: string,
  token?: string,
  contentType?: string,
): Promise<T> {
  const response = await sendRequest<T>('DELETE', url, token, undefined, contentType);
  return response as T;
}
