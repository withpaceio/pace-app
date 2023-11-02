import React, { type FC } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller, useFormContext } from 'react-hook-form';
import styled from 'styled-components/native';

import { useTheme } from '@theme';

import { Modal, ModalButton, ModalButtonLabel, ModalSeparator } from '@components/ui';

import type { HealthInformation } from '@models/HealthInformation';

const StyledDateTimePicker = styled(DateTimePicker)`
  width: 100%;
`;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const BirthDatePickerModalIOS: FC<Props> = ({ visible, onClose }) => {
  const { control } = useFormContext<HealthInformation>();

  const theme = useTheme();

  return (
    <Modal width="80%" visible={visible}>
      <Controller
        control={control}
        render={({ field: { value, onChange } }) => (
          <StyledDateTimePicker
            mode="date"
            display="spinner"
            accentColor={theme.colors.purple}
            value={value ? new Date(value) : new Date()}
            onChange={(_, selectedDate) => {
              if (!selectedDate) {
                return;
              }

              onChange(selectedDate.toISOString());
            }}
          />
        )}
        name="birthDate"
        rules={{ required: true }}
      />
      <ModalSeparator>
        <ModalButton onPress={onClose}>
          <ModalButtonLabel>OK</ModalButtonLabel>
        </ModalButton>
      </ModalSeparator>
    </Modal>
  );
};

export default BirthDatePickerModalIOS;
