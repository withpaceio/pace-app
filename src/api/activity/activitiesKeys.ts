const activitiesKeys = {
  timeline: () => ['activities', 'timeline'],
  locations: (activityId: string | undefined, activityEncryptionKey: string | undefined) => [
    'activities',
    'locations',
    activityId,
    activityEncryptionKey,
  ],
  mapSnapshot: (
    activityId: string | undefined,
    activityEncryptionKey: string | undefined,
    theme: 'light' | 'dark',
  ) => ['activities', 'mapSnapshot', activityId, activityEncryptionKey, theme],
  create: () => ['activities', 'create'],
  update: () => ['activities', 'update'],
  delete: () => ['activities', 'delete'],
  uploadData: () => ['activities', 'uploadData'],
};

export default activitiesKeys;
