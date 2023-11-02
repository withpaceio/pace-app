import styled from 'styled-components/native';

export const Wrapper = styled.View`
  padding-top: ${({ theme }) => theme.sizes.innerPadding}px;
  padding-left: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-right: ${({ theme }) => theme.sizes.outerPadding}px;

  background-color: ${({ theme }) => theme.colors.background};
`;

export const InnerWrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: ${({ theme }) => theme.sizes.outerPadding}px;
  padding-top: ${({ theme }) => theme.sizes.innerPadding}px;
  border-radius: 10px;

  background-color: ${({ theme }) => theme.colors.componentBackground};
`;

export const RowWrapper = styled.View`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  padding-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

export const StatWrapper = styled.View`
  flex: 1;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const StatTitle = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 3px;
`;

export const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;
