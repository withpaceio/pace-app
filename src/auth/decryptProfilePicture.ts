import { KeyPair, boxOpen, decodeBase64, encodeUtf8, secretboxOpen } from 'react-native-nacl-jsi';

function decryptLegacy(
  encryptedPictureBuffer: Uint8Array,
  encryptionKey: Uint8Array,
): { pictureBuffer: Uint8Array; encryptionKey: Uint8Array } {
  const legacyEncryptionKey = decodeBase64(encodeUtf8(encryptionKey));

  return {
    pictureBuffer: secretboxOpen(encryptedPictureBuffer, legacyEncryptionKey),
    encryptionKey: legacyEncryptionKey,
  };
}

export default function decryptProfilePicture(
  encryptedProfilePicture: string,
  encryptedProfilePictureEncryptionKey: string,
  encryptionKeyPair: KeyPair,
): { picture: string; encryptionKey: Uint8Array } {
  let encryptionKey = boxOpen(
    decodeBase64(encryptedProfilePictureEncryptionKey),
    encryptionKeyPair.publicKey,
    encryptionKeyPair.secretKey,
  );
  const encryptedPictureBuffer = decodeBase64(encryptedProfilePicture);

  let pictureBuffer: Uint8Array;
  try {
    pictureBuffer = secretboxOpen(encryptedPictureBuffer, encryptionKey);
  } catch {
    ({ pictureBuffer, encryptionKey } = decryptLegacy(encryptedPictureBuffer, encryptionKey));
  }

  return { picture: encodeUtf8(pictureBuffer), encryptionKey };
}
