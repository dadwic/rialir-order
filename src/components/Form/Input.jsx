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
          required
          fullWidth
          error={Boolean(error)}
          helperText={error?.message}
          {...props}
        />
      )}
    />
  );
}
