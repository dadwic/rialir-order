import React from 'react';
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export default function Input({ control, name, onPaste, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          error={Boolean(error)}
          helperText={error?.message}
          onPaste={(e) =>
            field.onChange(
              '0' + e.clipboardData.getData('text').replace(/\s+|(.+98)/g, '')
            )
          }
          {...props}
        />
      )}
    />
  );
}
