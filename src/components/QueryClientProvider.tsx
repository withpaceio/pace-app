import React, { type FC, type ReactNode, useCallback, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import accountKeys from '@api/account/accountKeys';
import { useQueryFn as useQueryFnAccountDetails } from '@api/account/useAccount';
import activitiesKeys from '@api/activity/activitiesKeys';
import { useMutationFn as useMutationFnCreateActivity } from '@api/activity/useCreateActivity';
import { useMutationFn as useMutationFnDeleteActivity } from '@api/activity/useDeleteActivity';
import { useMutationFn as useMutationFnUpdateActivity } from '@api/activity/useUpdateActivity';
import healthInformationKeys from '@api/healthInformation/healthInformationKeys';
import { useQueryFn as useQueryFnHealthInformationDetails } from '@api/healthInformation/useHealthInformation';
import { useMutationFn as useMutationFnUpdateHealthInformation } from '@api/healthInformation/useUpdateHealthInformation';
import preferencesKeys from '@api/preferences/preferencesKeys';
import { useQueryFn as useQueryFnPreferencesDetails } from '@api/preferences/usePreferences';
import { useMutationFn as useMutationFnUpdateDefaultActivityType } from '@api/preferences/useUpdateDefaultActivityType';
import { useMutationFn as useMutationFnUpdateDisplayPreferences } from '@api/preferences/useUpdateDisplayPreferences';
import profilePictureKeys from '@api/profilePicture/profilePictureKeys';
import { useMutationFn as useMutationFnDeleteProfilePicture } from '@api/profilePicture/useDeleteProfilePicture';
import { useQueryFn as useQueryFnProfilePictureDetails } from '@api/profilePicture/useProfilePicture';
import { useMutationFn as useMutationFnUpdateProfilePicture } from '@api/profilePicture/useUpdateProfilePicture';

import queryClient from '../queryClient';

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

type Props = {
  children: ReactNode;
};

const QueryClientProvider: FC<Props> = ({ children }) => {
  const queryFnAccountDetails = useQueryFnAccountDetails();

  const mutationFnCreateActivity = useMutationFnCreateActivity();
  const mutationFnUpdateActivity = useMutationFnUpdateActivity();
  const mutationFnDeleteActivity = useMutationFnDeleteActivity();

  const queryFnHealthInformationDetails = useQueryFnHealthInformationDetails();
  const mutationFnUpdateHealthInformation = useMutationFnUpdateHealthInformation();

  const queryFnPreferencesDetails = useQueryFnPreferencesDetails();
  const mutationFnUpdateDefaultActivityType = useMutationFnUpdateDefaultActivityType();
  const mutationFnUpdateDisplayPreferences = useMutationFnUpdateDisplayPreferences();

  const queryFnProfilePictureDetails = useQueryFnProfilePictureDetails();
  const mutationFnDeleteProfilePicture = useMutationFnDeleteProfilePicture();
  const mutationFnUpdateProfilePicture = useMutationFnUpdateProfilePicture();

  const onSuccess = useCallback(async (): Promise<void> => {
    await queryClient.resumePausedMutations();
    queryClient.invalidateQueries();
  }, []);

  const setDefaultQueries = useCallback((): void => {
    queryClient.setQueryDefaults(accountKeys.details(), {
      queryFn: queryFnAccountDetails,
    });

    queryClient.setQueryDefaults(healthInformationKeys.details(), {
      queryFn: queryFnHealthInformationDetails,
    });

    queryClient.setQueryDefaults(profilePictureKeys.details(), {
      queryFn: queryFnProfilePictureDetails,
    });

    queryClient.setQueryDefaults(preferencesKeys.details(), {
      queryFn: queryFnPreferencesDetails,
    });
  }, [
    queryFnAccountDetails,
    queryFnHealthInformationDetails,
    queryFnProfilePictureDetails,
    queryFnPreferencesDetails,
  ]);

  const setDefaultMutations = useCallback((): void => {
    queryClient.setMutationDefaults(activitiesKeys.create(), {
      mutationFn: mutationFnCreateActivity,
    });
    queryClient.setMutationDefaults(activitiesKeys.update(), {
      mutationFn: mutationFnUpdateActivity,
    });
    queryClient.setMutationDefaults(activitiesKeys.delete(), {
      mutationFn: mutationFnDeleteActivity,
    });

    queryClient.setMutationDefaults(healthInformationKeys.update(), {
      mutationFn: mutationFnUpdateHealthInformation,
    });

    queryClient.setMutationDefaults(preferencesKeys.updateDefaultActivityType(), {
      mutationFn: mutationFnUpdateDefaultActivityType,
    });
    queryClient.setMutationDefaults(preferencesKeys.updateDisplayPreferences(), {
      mutationFn: mutationFnUpdateDisplayPreferences,
    });

    queryClient.setMutationDefaults(profilePictureKeys.update(), {
      mutationFn: mutationFnUpdateProfilePicture,
    });
    queryClient.setMutationDefaults(profilePictureKeys.delete(), {
      mutationFn: mutationFnDeleteProfilePicture,
    });
  }, [
    mutationFnCreateActivity,
    mutationFnUpdateActivity,
    mutationFnDeleteActivity,
    mutationFnUpdateHealthInformation,
    mutationFnUpdateDefaultActivityType,
    mutationFnUpdateDisplayPreferences,
    mutationFnUpdateProfilePicture,
    mutationFnDeleteProfilePicture,
  ]);

  useEffect(() => {
    setDefaultQueries();
    setDefaultMutations();
  }, [setDefaultQueries, setDefaultMutations]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={onSuccess}>
      {children}
    </PersistQueryClientProvider>
  );
};

export default QueryClientProvider;
