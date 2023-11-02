import { boxGenerateKey, signGenerateKey } from 'react-native-nacl-jsi';

import type { UserKeyPair } from './types';

export default function generateKeys(): UserKeyPair {
  const encryptionKeyPair = boxGenerateKey();
  const signingKeyPair = signGenerateKey();
  return { encryptionKeyPair, signingKeyPair };
}
