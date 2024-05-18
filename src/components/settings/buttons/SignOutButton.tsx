import React, { type FC, useCallback } from 'react';

import { useTheme } from '@theme';

import useSignOut from '@api/auth/useSignOut';

import { OutArrowIcon } from '@components/icons';

import i18n from '@translations/i18n';

import SigningOutModal from '../SigningOutModal';
import { EntryWrapper, ICON_SIZE, IconWrapper, Label } from './common';

const SignOutButton: FC = () => {
  const theme = useTheme();

  const { mutate: signOut, isPending: isSignOutLoading } = useSignOut();

  const onSignOut = useCallback((): void => {
    signOut();
  }, [signOut]);

  return (
    <>
      <EntryWrapper onPress={onSignOut}>
        <IconWrapper>
          <OutArrowIcon width={ICON_SIZE} height={ICON_SIZE} color={theme.colors.primary} />
        </IconWrapper>
        <Label>{i18n.t('settings.buttons.signOut')}</Label>
      </EntryWrapper>
      <SigningOutModal visible={isSignOutLoading} />
    </>
  );
};

export default SignOutButton;
