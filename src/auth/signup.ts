import * as base64 from '@stablelib/base64';
import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import { argon2idDeriveKey } from 'react-native-nacl-jsi';

import { ARGON2ID_ITERATIONS, HKDF_PASSWORD_TOKEN_LENGTH } from '@crypto';

import type { SignUpResponse } from '@models/SignUp';
import { API_URL, sendPostRequest } from '@utils/sendRequest';

import encryptProfileData from './encryptProfileData';
import generateProfile from './generateProfile';
import * as SRP from './srp';

export default async function signUp(username: string, password: string): Promise<void> {
  const profileData = generateProfile();
  const encryptedProfileData = await encryptProfileData(profileData, password);

  const hashedPassword = argon2idDeriveKey(
    password,
    profileData.passwordHashSalt,
    32,
    ARGON2ID_ITERATIONS,
    BigInt(32768 * 1024),
  );

  const authPasswordTokenBuffer = new HKDF(
    SHA256,
    base64.decode(hashedPassword),
    base64.decode(profileData.authHashedPasswordSalt),
  ).expand(HKDF_PASSWORD_TOKEN_LENGTH);

  const srpParameters = SRP.getParameters();
  const srpSalt = await SRP.generateSalt(srpParameters);
  const srpPrivateKey = await SRP.derivePrivateKey(
    srpSalt,
    username,
    base64.encode(authPasswordTokenBuffer),
    srpParameters,
  );
  const srpVerifier = SRP.deriveVerifier(srpPrivateKey, srpParameters);

  const {
    passwordHashSalt,
    authHashedPasswordSalt,
    profileEncryptionSalt,
    keyPairs: {
      encryptionKeyPair: { publicKey: encryptionPublicKey },
      signingKeyPair: { publicKey: signingPublicKey },
    },
  } = profileData;

  await sendPostRequest<SignUpResponse>(`${API_URL}/api/auth/signup`, undefined, {
    username,
    srpSalt,
    srpVerifier,
    encryptionPublicKey,
    signingPublicKey,
    passwordHashSalt,
    passwordTokenSalt: authHashedPasswordSalt,
    profileEncryptionSalt,
    encryptedProfileData,
  });
}
