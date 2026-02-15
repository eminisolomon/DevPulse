import React from 'react';
import {
  Controller,
  ControllerProps,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';
import { View, ViewStyle } from 'react-native';

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Form = <T extends FieldValues>({
  form,
  children,
  style,
}: FormProps<T>) => {
  return <View style={style}>{children}</View>;
};

export const FormField = <T extends FieldValues>({
  name,
  control,
  render,
  rules,
}: Omit<ControllerProps<T>, 'render'> & {
  render: (props: {
    field: any;
    fieldState: any;
    formState: any;
  }) => React.ReactElement;
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState, formState }) =>
        render({ field, fieldState, formState })
      }
    />
  );
};
