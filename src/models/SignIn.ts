import { object, string } from 'yup';

import i18n from '@translations/i18n';

export const SignInSchema = object().shape({
  username: string().required(i18n.t('signIn.errors.username.missing')),
  password: string().required(i18n.t('signIn.errors.password.missing')),
});

export type SignInResponse = {
  serverSessionProof: string;
  userId: string;
  username: string;
  createdAt: Date;
  encryptionPublicKey: string;
  signingPublicKey: string;
  encryptedProfileData: string;
  profileEncryptionSalt: string;
  serverPublicKey: string;
  encryptedAuthToken: string;
};
