import type { KeyPair } from 'react-native-nacl-jsi';

export type UserKeyPair = {
  encryptionKeyPair: KeyPair;
  signingKeyPair: KeyPair;
};
