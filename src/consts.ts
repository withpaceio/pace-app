export const MAPTILER_URL_LIGHT = `https://api.maptiler.com/maps/topo/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`;
export const MAPTILER_URL_DARK = `https://api.maptiler.com/maps/b9b302de-1ce7-4be3-86d7-f1868e84a292/style.json?key=${process.env.EXPO_PUBLIC_MAPTILER_API_KEY}`;

export const CONTRIBUTORS_COPYRIGHT = '© MapTiler © OpenStreetMap contributors';

export const REVENUE_CAT_API_KEY_ANDROID = process.env
  .EXPO_PUBLIC_REVENUE_CAT_API_KEY_ANDROID as string;
export const REVENUE_CAT_API_KEY_IOS = process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_IOS as string;

export const REVENUE_CAT_ENTITLEMENT_MONTHLY_ID = 'pro';
export const REVENUE_CAT_ENTITLEMENT_YEARLY_ID = 'pro-yearly';

export const NUMBER_FREE_ACTIVITIES = parseInt(
  process.env.EXPO_PUBLIC_FREE_NUMBER_ACTIVITIES as string,
  10,
);
