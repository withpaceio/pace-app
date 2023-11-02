import React, { type FC } from 'react';

import styled from 'styled-components/native';

import { ActivityIndicator, Text } from '@components/ui';

import { NumberActivities } from '@models/Activity';
import i18n from '@translations/i18n';

const Wrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NumberActivitiesText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
`;

type Props = {
  numberActivities: NumberActivities | undefined;
  fetching: boolean;
  hasError: boolean;
};

const AccountSummary: FC<Props> = ({ numberActivities, fetching, hasError }) => (
  <Wrapper>
    {fetching && !numberActivities && !hasError && <ActivityIndicator />}
    {numberActivities && (
      <NumberActivitiesText>
        {i18n.t('account.numberActivities', { numberActivities: numberActivities.running })}
      </NumberActivitiesText>
    )}
  </Wrapper>
);

export default AccountSummary;
