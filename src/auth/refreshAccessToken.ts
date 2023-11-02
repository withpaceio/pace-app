import type { RefreshTokenResponse } from '@models/RefreshToken';
import { API_URL, sendPostRequest } from '@utils/sendRequest';

import { saveRefreshToken } from './storage';

async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse | null> {
  try {
    const data = await sendPostRequest<RefreshTokenResponse>(
      `${API_URL}/api/auth/token`,
      undefined,
      {
        refreshToken,
      },
    );

    await saveRefreshToken(data.refreshToken);

    return data;
  } catch {
    return null;
  }
}

export default refreshAccessToken;
