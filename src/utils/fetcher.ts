import { API_URL, sendGetRequest } from './sendRequest';

export default async function fetcher<T>(
  url: string,
  token?: string,
  contentType?: string,
): Promise<T> {
  return sendGetRequest<T>(`${API_URL}${url}`, token, contentType);
}
