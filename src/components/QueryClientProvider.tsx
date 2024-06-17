import React, { type FC, type ReactNode, useCallback, useEffect } from 'react';

import { onlineManager } from '@tanstack/react-query';
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

import useQueryClient from '../queryClient/queryClient';
import { persister } from '../queryClient/storagePersister';

type Props = {
  children: ReactNode;
};

const QueryClientProvider: FC<Props> = ({ children }) => {
  const queryClient = useQueryClient();

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
    if (!onlineManager.isOnline()) {
      return;
    }

    await queryClient.resumePausedMutations();
    queryClient.invalidateQueries({ queryKey: activitiesKeys.timeline() });
    queryClient.refetchQueries({ queryKey: profilePictureKeys.details() });
    queryClient.refetchQueries({ queryKey: preferencesKeys.details() });
    queryClient.refetchQueries({ queryKey: healthInformationKeys.details() });
  }, [queryClient]);

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
    queryClient,
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
    queryClient,
  ]);

  useEffect(() => {
    setDefaultQueries();
    setDefaultMutations();
  }, [setDefaultQueries, setDefaultMutations]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister, maxAge: Infinity }}
      onSuccess={onSuccess}>
      {children}
    </PersistQueryClientProvider>
  );
};

export default QueryClientProvider;
