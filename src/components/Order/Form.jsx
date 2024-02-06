import React, { useContext, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LiraIcon from '@mui/icons-material/CurrencyLira';
import { AppContext, AppDispatchContext } from '../../context';
import Input from '../Form/Input';
import Invoice from './Invoice';

const schema = yup
  .object({
    subtotal: yup
      .number()
      .required('لینک محصول الزامی است.')
      .typeError('فقط عدد وارد کنید.'),
    description: yup.string().required('لینک محصول الزامی است.'),
    products: yup.array().of(
      yup.object().shape({
        link: yup
          .string()
          .url('لینک معتبر وارد کنید.')
          .required('لینک محصول الزامی است.'),
      })
    ),
  })
  .required();

export default function PricingForm() {
  const form = useRef(null);
  const { order } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [editMode, setEditMode] = useState(true);
  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: order,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const onSubmit = (data) => {
    dispatch({ type: 'set_order', data });
    setEditMode(false);
  };

  if (!editMode) return <Invoice onEdit={() => setEditMode(true)} />;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        ref={form}
        method="post"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              fullWidth
              size="large"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => append({ link: '' })}
            >
              افزودن محصول جدید به سفارش
            </Button>
          </Grid>
          {fields.map((field, index) => (
            <Grid item xs={12} key={index}>
              <Input
                id={field.id}
                control={control}
                name={`products.${index}.link`}
                label={`لینک محصول ${index + 1}`}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => remove(index)}
                      disabled={index === 0 && fields.length === 1}
                    >
                      <CloseIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Input
              control={control}
              name="subtotal"
              id="subtotal"
              label="مبلغ کل به لیر"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LiraIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              control={control}
              name="description"
              id="description"
              label="توضیحات"
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          sx={{ my: 2 }}
        >
          ثبت سفارش
        </Button>
      </Box>
    </Box>
  );
}
