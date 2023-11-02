import type { PasswordSaltResponse } from '@models/PasswordSalt';
import { API_URL, sendPostRequest } from '@utils/sendRequest';

export async function fetchPasswordSalt(
  username: string,
  ephemeral: string,
): Promise<PasswordSaltResponse> {
  const data = await sendPostRequest<PasswordSaltResponse>(
    `${API_URL}/api/auth/password-salt`,
    undefined,
    { username, ephemeral },
  );

  return data;
}
