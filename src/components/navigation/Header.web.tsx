import type { FC } from 'react';

import { Link } from 'expo-router';

import styled from 'styled-components/native';

import useAccount from '@api/account/useAccount';
import useProfilePicture from '@api/profilePicture/useProfilePicture';

import { PaceIcon } from '@components/icons';
import { Text } from '@components/ui';

const ICON_SIZE = 30;

const Wrapper = styled.View`
  height: 50px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.825);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 15px;
  padding-right: 15px;
`;

const MenuLogo = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const MenuLogoText = styled(Text)`
  color: ${(props) => props.theme.colors.white};

  font-size: 28px;
  font-family: Roboto-BlackItalic;
  letter-spacing: -3px;

  margin-left: 0px;
  margin-top: 3px;
`;

const RightWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const AvatarWrapper = styled.View`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  border-radius: ${ICON_SIZE / 2}px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background-color: rgba(164, 121, 255, 0.5);
`;

const ProfilePicture = styled.Image`
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  border-radius: ${ICON_SIZE / 2}px;
`;

const Header: FC = () => {
  const { data: accountData } = useAccount();
  const { data: profilePictureData } = useProfilePicture();

  return (
    <Wrapper>
      <Link href="/">
        <MenuLogo>
          <PaceIcon width={ICON_SIZE} height={ICON_SIZE} />
          <MenuLogoText>PACE</MenuLogoText>
        </MenuLogo>
      </Link>
      <RightWrapper>
        <Link href="/account">
          <AvatarWrapper>
            {profilePictureData ? (
              <ProfilePicture source={{ uri: profilePictureData }} />
            ) : (
              <Text>{accountData?.username.substring(0, 1).toUpperCase()}</Text>
            )}
          </AvatarWrapper>
        </Link>
      </RightWrapper>
    </Wrapper>
  );
};

export default Header;
