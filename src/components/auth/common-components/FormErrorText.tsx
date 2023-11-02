import styled from 'styled-components/native';

import FormText from './FormText';

const FormErrorText = styled(FormText)`
  color: ${({ theme }) => theme.colors.red};
  margin-top: ${({ theme }) => theme.sizes.innerPadding}px;
`;

export default FormErrorText;
