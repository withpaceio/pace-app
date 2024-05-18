import React, { type FC, useMemo } from 'react';

import { Link } from 'expo-router';

import { format } from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import useAccount from '@api/account/useAccount';
import useProfilePicture from '@api/profilePicture/useProfilePicture';

import { CameraIcon, SettingsIcon } from '@components/icons';
import { SecondaryButton, Text } from '@components/ui';

import i18n from '@translations/i18n';

const Wrapper = styled.View<{ safeMarginTop: number }>`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  padding-top: ${({ safeMarginTop, theme }) => safeMarginTop + theme.sizes.outerPadding}px;
  padding-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ProfilePictureWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DefaultAvatarWrapper = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: rgba(164, 121, 255, 0.25);
`;

const Initials = styled(Text)`
  font-size: 60px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.purple};
`;

const ProfilePicture = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const CameraIconWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  position: absolute;
  left: 70px;
  top: 60px;

  width: 34px;
  height: 34px;
  border-radius: 17px;

  background-color: ${({ theme }) => theme.colors.componentBackground};

  shadow-radius: 5px;
  shadow-offset: 0px 0px;
  shadow-color: ${({ theme }) => theme.colors.primary};
  shadow-opacity: 0.3;
  elevation: 5;
`;

const AccountWrapper = styled.View`
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding}px;
`;

const DetailsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  margin-left: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};
`;

const UsernameText = styled(Text)`
  font-size: 20px;
  font-weight: bold;
`;

const AccountHeader: FC = () => {
  const { top } = useSafeAreaInsets();
  const theme = useTheme();

  const { data: accountData } = useAccount();
  const { data: profilePictureData } = useProfilePicture();

  const formattedDate = useMemo(() => {
    if (!accountData?.createdAt) {
      return '';
    }

    return `${i18n.t('account.joined')} ${format(accountData.createdAt, 'MMMM do, y')}`;
  }, [accountData?.createdAt]);

  return (
    <Wrapper safeMarginTop={top}>
      <Link href="/settings/profile-picture">
        <ProfilePictureWrapper>
          <DefaultAvatarWrapper>
            {profilePictureData ? (
              <ProfilePicture source={{ uri: profilePictureData }} />
            ) : (
              <Initials>{accountData?.username.substring(0, 1).toUpperCase()}</Initials>
            )}
          </DefaultAvatarWrapper>
          <CameraIconWrapper>
            <CameraIcon width={20} height={20} color={theme.colors.primary} />
          </CameraIconWrapper>
        </ProfilePictureWrapper>
      </Link>
      <DetailsWrapper>
        <AccountWrapper>
          <UsernameText>{accountData?.username}</UsernameText>
          <Text>{formattedDate}</Text>
        </AccountWrapper>
        <Link href="/settings" asChild>
          <SecondaryButton label={i18n.t('account.buttons.settings')} Icon={SettingsIcon} />
        </Link>
      </DetailsWrapper>
    </Wrapper>
  );
};

export default AccountHeader;
