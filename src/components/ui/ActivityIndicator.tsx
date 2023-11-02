import React, { FC } from 'react';
import { ActivityIndicatorProps, ActivityIndicator as NativeActivityIndicator } from 'react-native';

import { useTheme } from '../../theme';

const ActivityIndicator: FC<ActivityIndicatorProps> = (props) => {
  const theme = useTheme();

  return <NativeActivityIndicator color={theme.colors.purple} {...props} />;
};

export default ActivityIndicator;
