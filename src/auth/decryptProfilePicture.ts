import { KeyPair, boxOpen, decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

export default function decryptProfilePicture(
  encryptedProfilePicture: string,
  encryptedProfilePictureEncryptionKey: string,
  encryptionKeyPair: KeyPair,
): { picture: string; encryptionKey: Uint8Array } {
  const encryptionKey = boxOpen(
    decodeBase64(encryptedProfilePictureEncryptionKey),
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );

  const pictureBuffer = secretboxOpen(decodeBase64(encryptedProfilePicture), encryptionKey);

  return { picture: encodeUtf8(pictureBuffer), encryptionKey };
}
