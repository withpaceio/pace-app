import type { UserKeyPair } from '../crypto';

export type ProfileData = {
  passwordHashSalt: Uint8Array;
  authHashedPasswordSalt: Uint8Array;
  profileEncryptionSalt: Uint8Array;
  keyPairs: UserKeyPair;
};
