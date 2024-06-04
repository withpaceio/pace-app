export const API_URL = process.env.EXPO_PUBLIC_API_URL;
export const WEB_URL = process.env.EXPO_PUBLIC_WEB_URL;

async function sendRequest<T>(
  method: string,
  url: string,
  authToken?: string,
  payload?: unknown,
  contentType?: string,
  skipResponse?: boolean,
): Promise<T | undefined> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': contentType || 'application/json',
      ...(authToken ? { 'X-Auth-Token': authToken } : {}),
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
  authToken?: string,
  payload?: object,
  contentType?: string,
): Promise<T> {
  const response = await sendRequest<T>('POST', url, authToken, payload, contentType);
  return response as T;
}

export async function sendPutRequest<T>(
  url: string,
  authToken?: string,
  payload?: unknown,
  contentType?: string,
  skipResponse?: boolean,
): Promise<T> {
  const response = await sendRequest<T>('PUT', url, authToken, payload, contentType, skipResponse);
  return response as T;
}

export async function sendPatchRequest<T>(
  url: string,
  authToken?: string,
  payload?: unknown,
  contentType?: string,
  skipResponse?: boolean,
): Promise<T> {
  const response = await sendRequest<T>(
    'PATCH',
    url,
    authToken,
    payload,
    contentType,
    skipResponse,
  );
  return response as T;
}

export async function sendGetRequest<T>(
  url: string,
  authToken?: string,
  contentType?: string,
): Promise<T> {
  const response = await sendRequest<T>('GET', url, authToken, undefined, contentType);
  return response as T;
}

export async function sendDeleteRequest<T>(
  url: string,
  authToken?: string,
  contentType?: string,
): Promise<T> {
  const response = await sendRequest<T>('DELETE', url, authToken, undefined, contentType);
  return response as T;
}
