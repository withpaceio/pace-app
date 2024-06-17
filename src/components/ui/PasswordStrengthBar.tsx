import React, { type FC, useEffect, useMemo } from 'react';

import styled from 'styled-components/native';
import zxcvbn from 'zxcvbn';

import { useTheme } from '@theme';

import i18n from '@translations/i18n';

import Text from './Text';

const Wrapper = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const BarWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Bar = styled.View<{ barColor: string; isOn: boolean; isLast?: boolean }>`
  flex-grow: 1;
  height: 3px;

  margin-right: ${({ isLast, theme }) => (isLast ? 0 : theme.sizes.innerPadding / 2)}px;
  margin-bottom: ${({ theme }) => theme.sizes.innerPadding / 2}px;

  background-color: ${({ barColor, isOn, theme }) =>
    isOn ? barColor : theme.colors.componentBackground};
`;

const Label = styled(Text)`
  align-self: flex-end;
`;

type Props = {
  password: string;
  onScoreChanged?: (score: number) => void;
};

const PasswordStrengthBar: FC<Props> = ({ password, onScoreChanged }) => {
  const theme = useTheme();

  const scores = useMemo(
    () => [
      { barColor: theme.colors.componentBackground, label: i18n.t('passwordStrength.tooShort') },
      { barColor: theme.colors.red, label: i18n.t('passwordStrength.weak') },
      { barColor: theme.colors.orange, label: i18n.t('passwordStrength.okay') },
      { barColor: theme.colors.yellow, label: i18n.t('passwordStrength.good') },
      { barColor: theme.colors.green, label: i18n.t('passwordStrength.strong') },
    ],
    [theme],
  );

  const { score, barColor, label } = useMemo(() => {
    if (!password) {
      return { score: 0, ...scores[0] };
    }

    const { score: localScore } = zxcvbn(password);
    return { score: localScore, ...scores[localScore] };
  }, [password, scores]);

  useEffect(() => {
    if (!onScoreChanged) {
      return;
    }

    onScoreChanged(score);
  }, [onScoreChanged, score]);

  return (
    <Wrapper>
      <BarWrapper>
        <Bar barColor={barColor} isOn={score >= 1} />
        <Bar barColor={barColor} isOn={score >= 2} />
        <Bar barColor={barColor} isOn={score >= 3} />
        <Bar barColor={barColor} isOn={score >= 4} isLast />
      </BarWrapper>
      <Label>{label}</Label>
    </Wrapper>
  );
};

export default PasswordStrengthBar;
