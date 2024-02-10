import React, { useContext, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
      .min(32, 'توضیحات باید حداقل بیشتر از ۳۲ کاراکتر باشد.')
      .max(255, 'توضیحات نباید بیشتر از ۲۵۵ کاراکتر باشد.'),
    mobile: yup
      .string()
      .required('شماره موبایل گیرنده الزامی است.')
      .length(11, 'شماره موبایل شامل ۱۱ رقم می‌باشد.'),
    zipCode: yup
      .string()
      .required('کد پستی گیرنده الزامی است.')
      .length(10, 'کد پستی شامل ۱۰ رقم می‌باشد.'),
    address: yup
      .string()
      .required('آدرس دقیق الزامی است.')
      .min(32, 'آدرس باید حداقل بیشتر از ۳۲ کاراکتر باشد.')
      .max(255, 'آدرس نباید بیشتر از ۲۵۵ کاراکتر باشد.'),
    products: yup.array().of(
      yup.object().shape({
        link: yup
          .string()
          .url('لینک معتبر وارد کنید.')
          .required('لینک محصول الزامی است.'),
        size: yup.string().required('سایز محصول الزامی است.'),
        color: yup.string().required('رنگ محصول الزامی است.'),
      })
    ),
  })
  .required();

export default function PricingForm() {
  const form = useRef(null);
  const { order } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [editMode, setEditMode] = useState(true);
  const { control, watch, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: order,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  const newAddress = watch('newAddress');

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
              onClick={() =>
                append({ link: '', size: 'standard', color: 'default' })
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
                        onClick={() => remove(index)}
                        disabled={index === 0 && fields.length === 1}
                      >
                        <CloseIcon />
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
                    <option value="triple">سه نفره</option>
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
                  select
                  control={control}
                  label="رنگ"
                  name={`products.${index}.size`}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="default">پیش فرض</option>
                  {[
                    { value: 'black', label: 'مشکی' },
                    { value: 'white', label: 'سفید' },
                    { value: 'light-blue', label: 'آبی کم رنگ' },
                    { value: 'blue', label: 'آبی' },
                    { value: 'navy-blue', label: 'سرمه ای' },
                    { value: 'red', label: 'قرمز' },
                    { value: 'crimson', label: 'زرشکی' },
                    { value: 'green', label: 'سبز' },
                    { value: 'yellow', label: 'زرد' },
                    { value: 'pink', label: 'صورتی' },
                    { value: 'purple', label: 'بنفش' },
                    { value: 'orange', label: 'پرتغالی' },
                    { value: 'olive', label: 'زیتونی' },
                    { value: 'gray', label: 'خاکستری' },
                    { value: 'gold', label: 'طلایی' },
                    { value: 'silver', label: 'نقره ای' },
                    { value: 'chocolate', label: 'شکلاتی' },
                    { value: 'brown', label: 'قهوه ای' },
                    { value: 'beige', label: 'بژ' },
                    { value: 'khaki', label: 'خاکی' },
                    { value: 'azure', label: 'لاجوردی' },
                  ].map(({ value, label }, key) => (
                    <option key={key} value={value}>
                      {label}
                    </option>
                  ))}
                </Input>
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
              name="newAddress"
              id="newAddress"
              label="ارسال سفارش به آدرس شخص دیگر"
            />
          </Grid>
          {newAddress && (
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
          لطفا قبل از ثبت سفارش آدرس پستی دقیق خود را در صفحه آدرس ها اضافه
          کنید.
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
