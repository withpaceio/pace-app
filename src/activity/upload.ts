import { sendPutRequest } from '@utils/sendRequest';

async function uploadActivityLocations(url: string, locations: string): Promise<boolean> {
  try {
    await sendPutRequest(url, undefined, locations, 'application/octet-stream', true);
    return true;
  } catch {
    return false;
  }
}

async function uploadActivityMapSnapshot(url: string, mapSnapshot: string): Promise<boolean> {
  try {
    await sendPutRequest(url, undefined, mapSnapshot, 'application/octet-stream', true);
    return true;
  } catch {
    return false;
  }
}

export default async function upload(
  encryptedLocations: string,
  locationsUrl: string,
  encryptedMapImageDark: string,
  mapUrlDark: string,
  encryptedMapImageLight: string,
  mapUrlLight: string,
): Promise<boolean> {
  try {
    const results = await Promise.all([
      uploadActivityLocations(locationsUrl, encryptedLocations),
      uploadActivityMapSnapshot(mapUrlDark, encryptedMapImageDark),
      uploadActivityMapSnapshot(mapUrlLight, encryptedMapImageLight),
    ]);

    return results[0] && results[1] && results[2];
  } catch {
    return false;
  }
}
