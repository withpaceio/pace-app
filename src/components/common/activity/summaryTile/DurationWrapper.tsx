import styled from 'styled-components/native';

const DurationWrapper = styled.View`
  margin-left: 5px;
  margin-right: 5px;

  padding-left: 5px;
  padding-right: 5px;

  border-style: solid;
  border-color: ${({ theme }) => theme.colors.borderColor};
  border-left-width: 1px;
  border-right-width: 1px;
`;

export default DurationWrapper;
