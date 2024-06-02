import {
  KeyPair,
  SECRETBOX_KEY_LENGTH,
  boxSeal,
  decodeUtf8,
  encodeBase64,
  getRandomBytes,
  secretboxSeal,
} from 'react-native-nacl-jsi';

export default function encryptProfilePicture(
  profilePicture: string,
  encryptionKeyPair: KeyPair,
): { profileEncryptionKey: string; encryptedProfilePicture: string } {
  const profileEncryptionKey = getRandomBytes(SECRETBOX_KEY_LENGTH);

  const encryptedProfilePictureBuffer = secretboxSeal(
    decodeUtf8(profilePicture),
    profileEncryptionKey,
  );
  const encryptedProfileEncryptionKeyBuffer = boxSeal(
    profileEncryptionKey,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  return {
    profileEncryptionKey: encodeBase64(encryptedProfileEncryptionKeyBuffer),
    encryptedProfilePicture: encodeBase64(encryptedProfilePictureBuffer),
  };
}
