import React from 'react';
import { Controller } from 'react-hook-form';
import MuiCheckbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Checkbox({ control, name, label, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          label={label}
          control={<MuiCheckbox {...field} {...props} />}
        />
      )}
    />
  );
}
