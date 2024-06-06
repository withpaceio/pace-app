import type { SerializedUserKeyPair, UserKeyPair } from './types';

export type { SerializedUserKeyPair, UserKeyPair };

export {
  ARGON2ID_ITERATIONS,
  ARGON2ID_SALT_LENGTH,
  HKDF_PASSWORD_TOKEN_LENGTH,
  HKDF_SALT_LENGTH,
} from './consts';
export { default as generateKeys } from './generateKeys';
