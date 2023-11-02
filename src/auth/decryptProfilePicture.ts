import * as base64 from '@stablelib/base64';
import { KeyPair, boxOpen, secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptProfilePicture(
  encryptedProfilePicture: string,
  encryptedProfilePictureEncryptionKey: string,
  encryptionKeyPair: KeyPair,
): { picture: string; encryptionKey: Uint8Array } {
  const profilePictureEncryptionKeyString = boxOpen(
    encryptedProfilePictureEncryptionKey,
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  ).replace(/\0/g, '');
  const encryptionKey = base64.decode(profilePictureEncryptionKeyString);
  const picture = secretboxOpen(encryptedProfilePicture, profilePictureEncryptionKeyString).replace(
    /\0/g,
    '',
  );

  return { picture, encryptionKey };
}
