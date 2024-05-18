import React, { type FC } from 'react';

import { Controller, useFormContext } from 'react-hook-form';

import { TextInput } from '@components/ui';

import type { HealthInformation } from '@models/HealthInformation';
import { DistanceMeasurementSystem } from '@models/UnitSystem';

import i18n from '@translations/i18n';

type Props = {
  measurementSystem: DistanceMeasurementSystem;
  onSubmitHealthInformation: (healthInformation: HealthInformation) => void;
};

const WeightAttribute: FC<Props> = ({ measurementSystem, onSubmitHealthInformation }) => {
  const { control, handleSubmit } = useFormContext<HealthInformation>();

  return (
    <Controller
      control={control}
      render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
        <TextInput
          placeholder={i18n.t('settings.configureHealthInformation.inputs.weight.placeholder', {
            unit: measurementSystem === DistanceMeasurementSystem.METRIC ? 'kg' : 'lbs',
          })}
          value={value?.toString()}
          caption={error?.message}
          keyboardType="numeric"
          onBlur={onBlur}
          onChangeText={(weight: string) => {
            if (weight.length === 0) {
              onChange(null);
              return;
            }

            const newWeight = Number.parseInt(weight, 10);
            if (Number.isNaN(newWeight)) {
              onChange(null);
              return;
            }

            onChange(newWeight);
          }}
          onSubmitEditing={handleSubmit(onSubmitHealthInformation)}
        />
      )}
      name="weight"
      rules={{ required: true }}
    />
  );
};

export default WeightAttribute;
