import type { FC } from 'react';

import styled from 'styled-components/native';

import { Text } from '@components/ui';

const Wrapper = styled.View`
  position: fixed;

  width: 40%;
  height: 50px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: ${({ theme }) => theme.web.menuBarHeight}px;
  padding: ${({ theme }) => theme.sizes.innerPadding}px;

  border-color: ${({ theme }) => theme.colors.separatorColor};
  border-right-width: 1px;
  border-top-width: 1px;
  border-bottom-width: 1px;

  background-color: ${({ theme }) => theme.colors.background};

  z-index: 2;
`;

const ActivityListHeader: FC = () => (
  <Wrapper>
    <Text>Activities</Text>
  </Wrapper>
);

export default ActivityListHeader;
