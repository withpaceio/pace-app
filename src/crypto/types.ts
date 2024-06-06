import type { KeyPair } from 'react-native-nacl-jsi';

export type UserKeyPair = {
  encryptionKeyPair: KeyPair;
  signingKeyPair: KeyPair;
};

export type SerializedUserKeyPair = {
  encryptionKeyPair: {
    publicKey: string;
    secretKey: string;
  };
  signingKeyPair: {
    publicKey: string;
    secretKey: string;
  };
};
