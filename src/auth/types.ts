import type { UserKeyPair } from '../crypto';

export type ProfileData = {
  passwordHashSalt: string;
  authHashedPasswordSalt: string;
  profileEncryptionSalt: string;
  keyPairs: UserKeyPair;
};
