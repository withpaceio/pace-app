import {
  KeyPair,
  SECRETBOX_KEY_LENGTH,
  boxSeal,
  getRandomBytes,
  secretboxSeal,
} from 'react-native-nacl-jsi';

export default function encryptProfilePicture(
  profilePicture: string,
  encryptionKeyPair: KeyPair,
): { profileEncryptionKey: string; encryptedProfilePicture: string } {
  const profileEncryptionKey = getRandomBytes(SECRETBOX_KEY_LENGTH);

  const encryptedProfilePicture = secretboxSeal(profilePicture, profileEncryptionKey);
  const encryptedProfileEncryptionKey = boxSeal(
    profileEncryptionKey,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return { profileEncryptionKey: encryptedProfileEncryptionKey, encryptedProfilePicture };
}
