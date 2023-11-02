import React, { type FC, type ReactNode } from 'react';
import { Modal as RNModal } from 'react-native';

import styled from 'styled-components/native';

import Text from './Text';

const Wrapper = styled.View<{ hideBackdrop: boolean }>`
  flex: 1;

  justify-content: center;
  align-items: center;

  ${({ hideBackdrop, theme }) =>
    !hideBackdrop && `background-color: ${theme.colors.backdropColor};`}
`;

const ContentWrapper = styled.View<{ width: string | undefined }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: ${({ width }) => width || '65%'};
  background-color: ${({ theme }) => theme.colors.componentBackground};

  border-radius: 5px;
`;

export const Title = styled(Text)`
  padding-top: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-left: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-right: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-bottom: ${({ theme }) => theme.sizes.innerPadding}px;

  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

export const Subtitle = styled(Text)`
  padding-left: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-right: ${({ theme }) => theme.sizes.outerPadding}px;

  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;

  margin-bottom: ${({ theme }) => theme.sizes.outerPadding}px;
`;

export const Separator = styled.View`
  width: 100%;

  border-color: ${({ theme }) => (theme.dark ? '#323232' : '#EEEEEE')};
  border-top-width: 1px;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  padding-top: ${({ theme }) => theme.sizes.innerPadding + 5}px;
  padding-bottom: ${({ theme }) => theme.sizes.innerPadding + 5}px;
`;

export const ButtonLabel = styled(Text)`
  font-size: 16px;
  text-align: center;
`;

export const RedButtonLabel = styled(ButtonLabel)`
  color: ${({ theme }) => theme.colors.red};
  font-weight: bold;
`;

export const GreenButtonLabel = styled(ButtonLabel)`
  color: ${({ theme }) => theme.colors.green};
  font-weight: bold;
`;

type Props = {
  visible: boolean;
  width?: string;
  hideBackdrop?: boolean;
  children: ReactNode;
};

const Modal: FC<Props> = ({ visible, width, hideBackdrop, children }) => (
  <RNModal animationType="fade" visible={visible} transparent>
    <Wrapper hideBackdrop={!!hideBackdrop}>
      <ContentWrapper width={width}>{children}</ContentWrapper>
    </Wrapper>
  </RNModal>
);

export default Modal;
