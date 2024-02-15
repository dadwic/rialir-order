import React, { useContext, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LiraIcon from '@mui/icons-material/CurrencyLira';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { AppContext, AppDispatchContext } from '../../context';
import Checkbox from '../Form/Checkbox';
import Input from '../Form/Input';
import Invoice from './Invoice';
import { persianNumber } from '../../utils';

const schema = yup
  .object({
    subtotal: yup
      .number()
      .required('مبلغ کل الزامی است.')
      .typeError('فقط عدد وارد کنید.')
      .max(100000, 'مبلغ کل سفارش نباید بیشتر از ۱۰۰ هزار لیر باشد.'),
    description: yup
      .string()
      .required('توضیحات سفارش الزامی است.')
      .max(200, 'توضیحات نباید بیشتر از ۲۰۰ کاراکتر باشد.'),
    mobile: yup.string().when('new_address', {
      is: true,
      then: (schema) =>
        schema
          .required('شماره موبایل گیرنده الزامی است.')
          .length(11, 'شماره موبایل شامل ۱۱ رقم می‌باشد.'),
    }),
    zipCode: yup.string().when('new_address', {
      is: true,
      then: (schema) =>
        schema
          .required('کد پستی گیرنده الزامی است.')
          .length(10, 'کد پستی شامل ۱۰ رقم می‌باشد.'),
    }),
    address: yup.string().when('new_address', {
      is: true,
      then: (schema) =>
        schema
          .required('آدرس دقیق الزامی است.')
          .max(200, 'آدرس نباید بیشتر از ۲۰۰ کاراکتر باشد.'),
    }),
    products: yup.array().of(
      yup.object().shape({
        link: yup
          .string()
          .url('لینک معتبر وارد کنید.')
          .required('لینک محصول الزامی است.'),
        size: yup.string().required('سایز محصول الزامی است.'),
        description: yup
          .string()
          .required('توضیحات محصول الزامی است.')
          .max(32, 'توضیحات نباید بیشتر از ۳۲ کاراکتر باشد.'),
      })
    ),
  })
  .required();

export default function PricingForm() {
  const form = useRef(null);
  const { order } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [editMode, setEditMode] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { control, watch, setValue, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: order,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  const new_address = watch('new_address');

  const onSubmit = (data) => {
    dispatch({ type: 'set_order', data });
    setEditMode(false);
  };

  const createOrder = async (data) => {
    try {
      const response = await fetch(orderApi.root + 'wp/v2/order', {
        method: 'POST',
        headers: {
          'X-WP-Nonce': orderApi.nonce,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response.json());
      enqueueSnackbar('Successfully created.', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: 'error',
      });
    }
  };

  if (!editMode) {
    return <Invoice onEdit={() => setEditMode(true)} onSubmit={createOrder} />;
  }

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
              onClick={() =>
                append({ link: '', size: 'standard', description: '' })
              }
            >
              افزودن محصول جدید به سفارش
            </Button>
          </Grid>
          {fields.map((field, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12}>
                <Divider
                  sx={{
                    borderColor: (t) => t.palette.divider,
                    fontFamily: 'Vazirmatn',
                  }}
                >
                  <IconButton
                    edge="start"
                    size="small"
                    color="error"
                    onClick={() => remove(index)}
                    disabled={index === 0 && fields.length === 1}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Chip label={`محصول شماره ${persianNumber(index + 1)}`} />
                </Divider>
              </Grid>
              <Grid item xs={12}>
                <Input
                  id={field.id}
                  control={control}
                  label="لینک محصول"
                  name={`products.${index}.link`}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        edge="end"
                        color="error"
                        title="پاک کردن"
                        sx={{ transform: 'scaleX(-1)' }}
                        onClick={() => setValue(`products.${index}.link`, '')}
                      >
                        <BackspaceIcon />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  select
                  control={control}
                  label="سایز"
                  id={`products.${index}.size`}
                  name={`products.${index}.size`}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <optgroup label="سایز پیش فرض">
                    <option value="standard">استاندارد</option>
                  </optgroup>
                  <optgroup label="سایز های حروفی">
                    {[
                      '3XS',
                      'XXS',
                      'XS',
                      'S',
                      'S-M',
                      'M',
                      'L',
                      'L-XL',
                      'XL',
                      'XXL',
                      'XXL',
                      '3XL',
                      '4XL',
                      '5XL',
                      '6XL',
                    ].map((size) => (
                      <option value={size}>{size}</option>
                    ))}
                  </optgroup>
                  <optgroup label="سایز های متفرقه">
                    <option value="single">یک نفره</option>
                    <option value="double">دو نفره</option>
                  </optgroup>
                  <optgroup label="سایز های عددی">
                    {Array.from({ length: 80 }, (_, i) => (36 + i) / 2).map(
                      (size) => (
                        <option value={size}>{size}</option>
                      )
                    )}
                  </optgroup>
                </Input>
              </Grid>
              <Grid item xs={6}>
                <Input
                  control={control}
                  label="توضیحات محصول"
                  id={`products.${index}.description`}
                  name={`products.${index}.description`}
                />
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Input
              control={control}
              name="subtotal"
              id="subtotal"
              type="tel"
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
            <FormHelperText id="description-helper">
              سایز، رنگ و مشخصات دقیق محصولات را به فارسی بنویسید.
            </FormHelperText>
          </Grid>
          <Grid item xs={12}>
            <Checkbox
              control={control}
              name="new_address"
              id="new_address"
              label="ارسال سفارش به آدرس شخص دیگر"
            />
          </Grid>
          {new_address && (
            <>
              <Grid item xs={12}>
                <Input
                  control={control}
                  type="tel"
                  name="mobile"
                  id="mobile"
                  label="شماره موبایل گیرنده"
                  inputProps={{ maxLength: 11 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  control={control}
                  type="tel"
                  name="zipCode"
                  id="zipCode"
                  label="کد پستی گیرنده"
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Input
                  control={control}
                  name="address"
                  id="address"
                  label="آدرس دقیق تحویل کالا در ایران"
                />
              </Grid>
            </>
          )}
        </Grid>
        <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
          قبل از ثبت سفارش، آدرس پستی خود را در صفحه آدرس‌ها ثبت کنید.
        </Typography>
        <Button
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          sx={{ my: 1 }}
        >
          ثبت سفارش
        </Button>
      </Box>
    </Box>
  );
}
