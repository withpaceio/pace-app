import styled from 'styled-components/native';

const IconWrapper = styled.View`
  margin-right: ${({ theme }) => 0.5 * theme.sizes.innerPadding}px;

  padding: 4px;
  border-radius: 13px;

  background-color: ${({ theme }) => theme.colors.darkComponentBackground};
`;

export default IconWrapper;
