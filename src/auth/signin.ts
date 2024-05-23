import { HKDF } from '@stablelib/hkdf';
import { SHA256 } from '@stablelib/sha256';
import {
  argon2idDeriveKey,
  boxOpen,
  decodeBase64,
  decodeUtf8,
  encodeBase64,
} from 'react-native-nacl-jsi';
import Purchases from 'react-native-purchases';

import { ARGON2ID_ITERATIONS, HKDF_PASSWORD_TOKEN_LENGTH } from '@crypto';

import type { SignInResponse } from '@models/SignIn';

import { API_URL, sendPostRequest } from '@utils/sendRequest';

import decryptProfileData from './decryptProfileData';
import * as SRP from './srp';
import { saveProfile } from './storage';
import type { ProfileData } from './types';
import { fetchPasswordSalt } from './utils';

async function fetchSignIn(
  username: string,
  password: string,
): Promise<Omit<SignInResponse, 'serverSessionProof'> & { passwordHashSalt: string }> {
  const srpParameters = SRP.getParameters();
  const clientEphemeral = await SRP.generateEphemeral(srpParameters);

  const {
    passwordHashSalt,
    passwordTokenSalt,
    srpSalt,
    ephemeral: serverPublicEphemeral,
  } = await fetchPasswordSalt(username, clientEphemeral.public);

  const hashedPassword = argon2idDeriveKey(
    decodeUtf8(password),
    decodeBase64(passwordHashSalt),
    32,
    ARGON2ID_ITERATIONS,
    BigInt(32768 * 1024),
  );

  const authPasswordTokenBuffer = new HKDF(
    SHA256,
    hashedPassword,
    decodeBase64(passwordTokenSalt),
  ).expand(HKDF_PASSWORD_TOKEN_LENGTH);

  const privateKey = await SRP.derivePrivateKey(
    srpSalt,
    username,
    encodeBase64(authPasswordTokenBuffer),
    srpParameters,
  );

  const clientSession = SRP.deriveSession(
    clientEphemeral.secret,
    serverPublicEphemeral,
    srpSalt,
    username,
    privateKey,
    srpParameters,
  );

  const response = await sendPostRequest<SignInResponse>(`${API_URL}/api/auth/signin`, undefined, {
    username,
    proof: clientSession.proof,
    authMethod: 'auth-token',
  });

  const { serverSessionProof } = response;

  SRP.verifySession(clientEphemeral.public, clientSession, serverSessionProof, srpParameters);

  return { ...response, createdAt: new Date(response.createdAt), passwordHashSalt };
}

export default async function signIn(
  username: string,
  password: string,
): Promise<{
  userId: string;
  createdAt: Date;
  authToken: string;
  profileData: ProfileData;
}> {
  const {
    userId,
    createdAt,
    encryptedProfileData,
    profileEncryptionSalt,
    passwordHashSalt,
    encryptedAuthToken,
    serverPublicKey,
  } = await fetchSignIn(username, password);

  const profileData = decryptProfileData(
    encryptedProfileData,
    password,
    passwordHashSalt,
    profileEncryptionSalt,
  );

  const authTokenBuffer = boxOpen(
    decodeBase64(encryptedAuthToken),
    decodeBase64(serverPublicKey),
    profileData.keyPairs.encryptionKeyPair.secretKey,
  );

  const authToken = encodeBase64(authTokenBuffer);

  if (authToken === null) {
    throw new Error('Failed to decrypt the authentication token');
  }

  await saveProfile({
    userId,
    username,
    createdAt,
    authToken,
    profileData,
  });

  await Purchases.logIn(userId);

  return {
    userId,
    createdAt,
    authToken,
    profileData,
  };
}
