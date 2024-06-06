import type { SerializedUserKeyPair, UserKeyPair } from '../crypto';

export type ProfileData = {
  passwordHashSalt: Uint8Array;
  authHashedPasswordSalt: Uint8Array;
  profileEncryptionSalt: Uint8Array;
  keyPairs: UserKeyPair;
};

export type SerializedProfileData = {
  passwordHashSalt: string;
  authHashedPasswordSalt: string;
  profileEncryptionSalt: string;
  keyPairs: SerializedUserKeyPair;
};

export type Profile = {
  userId: string;
  username: string;
  createdAt: Date;
  authToken: string;
  profileData: ProfileData | null;
};
