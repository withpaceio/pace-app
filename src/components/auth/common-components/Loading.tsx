import React, { FC } from 'react';

import styled from 'styled-components/native';

import FormText from './FormText';
import { ActivityIndicator } from '../../ui';

const LoadingWrapper = styled.View`
  margin-top: 20px;
`;

type Props = {
  label: string;
};

const Loading: FC<Props> = ({ label }) => (
  <LoadingWrapper>
    <ActivityIndicator />
    <FormText>{label}</FormText>
  </LoadingWrapper>
);

export default Loading;
