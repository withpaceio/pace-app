import { object, string } from 'yup';

export const RefreshTokenSchema = object().shape({
  refreshToken: string().required('refreshToken is required'),
});

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
