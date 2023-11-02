import React, { type FC, useCallback, useState } from 'react';

import useDeleteAccount from '@api/account/useDeleteAccount';
import useSignOut from '@api/auth/useSignOut';

import ConfirmDeleteAccountModal from '@components/settings/ConfirmDeleteAccountModal';
import DeleteAccountWarningModal from '@components/settings/DeleteAccountWarningModal';
import DeletingAccountModal from '@components/settings/DeletingAccountModal';
import SettingsUI from '@components/settings/SettingsUI';

import type { SettingsScreenProps } from '@navigation/types';
import useCurrentSubscription from '@subscription/useCurrentSubscription';

const SettingsScreen: FC<SettingsScreenProps> = () => {
  const [deleteAccountWarningModalVisible, setDeleteAccountWarningModalVisible] = useState(false);
  const [confirmDeleteAccountModalVisible, setConfirmDeleteAccountModalVisible] = useState(false);
  const [deletingAccountModalVisible, setDeletingAccountModalVisible] = useState(false);

  const {
    mutate: deleteAccount,
    isPending: isDeleteAccountLoading,
    isError: isDeleteAccountError,
  } = useDeleteAccount();
  const { mutate: signOut } = useSignOut();

  const { currentSubscription } = useCurrentSubscription();

  const onDeleteAccount = useCallback((): void => {
    if (currentSubscription !== null) {
      setDeleteAccountWarningModalVisible(true);
      return;
    }

    setConfirmDeleteAccountModalVisible(true);
  }, [currentSubscription]);

  const deleteAccountAndSignOut = useCallback(async (): Promise<void> => {
    setConfirmDeleteAccountModalVisible(false);

    deleteAccount(undefined, {
      onSuccess: () => {
        signOut();
      },
    });
  }, [deleteAccount, signOut]);

  return (
    <>
      <SettingsUI onDeleteAccount={onDeleteAccount} />
      <DeleteAccountWarningModal
        visible={deleteAccountWarningModalVisible}
        onClose={() => setDeleteAccountWarningModalVisible(false)}
      />
      <ConfirmDeleteAccountModal
        visible={confirmDeleteAccountModalVisible}
        onConfirm={deleteAccountAndSignOut}
        onCancel={() => setConfirmDeleteAccountModalVisible(false)}
      />
      <DeletingAccountModal
        visible={isDeleteAccountLoading || deletingAccountModalVisible}
        hasError={isDeleteAccountError}
        onClose={() => {
          setDeletingAccountModalVisible(false);
        }}
      />
    </>
  );
};

export default SettingsScreen;
