import React, { type FC, useCallback, useMemo, useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { EditIcon } from '@components/icons';
import { Text } from '@components/ui';

import type { HealthInformation } from '@models/HealthInformation';

import BirthDatePickerModalIOS from './BirthDatePickerModalIOS';

const Wrapper = styled.View`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BirthDateLabel = styled(Text)`
  font-size: 16px;
`;

const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.red};
`;

const BirthDatePicker: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const theme = useTheme();

  const { watch, setValue, formState } = useFormContext<HealthInformation>();
  const birthDate = watch('birthDate');
  const birthDateLabel = useMemo(() => {
    if (!birthDate) {
      return 'Not configured';
    }

    return format(new Date(birthDate), 'LLLL dd, yyyy');
  }, [birthDate]);

  const onToggleDatePicker = useCallback((): void => {
    if (Platform.OS === 'ios') {
      setIsOpen(true);
      return;
    }

    DateTimePickerAndroid.open({
      mode: 'date',
      display: 'spinner',
      value: birthDate ? new Date(birthDate) : new Date(),
      onChange: (_, selectedDate) => {
        if (!selectedDate) {
          return;
        }

        setValue('birthDate', selectedDate.toISOString());
      },
    });
  }, []);

  return (
    <>
      <Wrapper>
        <BirthDateLabel>{birthDateLabel}</BirthDateLabel>
        <TouchableOpacity onPress={onToggleDatePicker}>
          <EditIcon width={27} height={27} color={theme.colors.primary} />
        </TouchableOpacity>
        {Platform.OS === 'ios' && (
          <BirthDatePickerModalIOS visible={isOpen} onClose={() => setIsOpen(false)} />
        )}
      </Wrapper>
      <ErrorText>{formState.errors.birthDate?.message}</ErrorText>
    </>
  );
};

export default BirthDatePicker;
