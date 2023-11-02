import styled from 'styled-components/native';

import { Text } from '@components/ui';

export const ICON_SIZE = 23;

export const EntryWrapper = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  padding-horizontal: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-vertical: ${({ theme }) => theme.sizes.innerPadding}px;
`;

export const IconWrapper = styled.View`
  margin-right: ${({ theme }) => theme.sizes.outerPadding}px;
`;

export const ConfigureWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  width: 100%;
`;

export const Label = styled(Text)`
  font-size: 16px;
`;

export const SecondaryLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.secondary};
`;
