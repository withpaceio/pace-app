import * as FileSystem from 'expo-file-system';

export const HEALTH_INFORMATION_LOCATION = 'HEALTH_INFORMATION';

export const PROFILE_STORAGE_PATH = `${FileSystem.cacheDirectory}/profilePicture`;
export const PROFILE_ENCRYPTION_KEY_STORAGE_PATH = `${FileSystem.cacheDirectory}/profilePictureEncryptionKey`;
