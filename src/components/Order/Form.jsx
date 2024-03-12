import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { toPng } from 'html-to-image';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Alert from '@mui/lab/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/CheckCircle';
import LiraIcon from '@mui/icons-material/CurrencyLira';
import BackspaceIcon from '@mui/icons-material/Backspace';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { AppContext, AppDispatchContext } from '../../context';
import { persianNumber } from '../../utils';
import NumericFormat from '../Form/NumericFormat';
import Checkbox from '../Form/Checkbox';
import Input from '../Form/Input';
import Invoice from './Invoice';

const schema = yup
  .object({
    subtotal: yup
      .number()
      .required('مبلغ کل الزامی است.')
      .typeError('فقط عدد وارد کنید.')
      .min(50, 'مبلغ کل باید بیشتر از ۵۰ لیر باشد.')
      .max(100000, 'مبلغ کل نباید بیشتر از ۱۰۰ هزار لیر باشد.'),
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
    postcode: yup.string().when('new_address', {
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
          .max(32, 'توضیحات نباید بیشتر از ۳۲ کاراکتر باشد.'),
      })
    ),
  })
  .required();

export default function PricingForm() {
  const form = useRef(null);
  const dispatch = useContext(AppDispatchContext);
  const [editMode, setEditMode] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { order, pricing, loading, error, success, orderId } =
    useContext(AppContext);
  const { control, watch, setValue, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    values: order,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });
  const new_address = watch('new_address');

  const updateRate = useCallback(async () => {
    dispatch({ type: 'set_loading', loading: true });
    // Update TRY price
    const res = await fetch(`${orderApi.root}${orderApi.versionString}pricing`);
    const data = await res.json();
    if (res.ok) dispatch({ type: 'set_pricing', data });
    else dispatch({ type: 'set_error', message: 'خطا در بروزرسانی قیمت لیر' });
  });

  useEffect(() => {
    updateRate();
    document.getElementById('order-app').scrollIntoView({ behavior: 'smooth' });
  }, [editMode]);

  const handleCapture = (callback) => {
    setSnackbarOpen(true);
    toPng(document.getElementById('invoice'), {
      cacheBust: true,
      quality: 1,
    }).then((dataUrl) => {
      var link = document.createElement('a');
      link.download = 'rialir-invoice.png';
      link.href = dataUrl;
      link.click();
      callback();
    });
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const onSubmit = async (form) => {
    await updateRate();
    const subtotal = parseFloat(form.subtotal);
    const fee = parseInt(pricing.fee);
    const rate = parseInt(pricing.try_irt) + fee;
    // Convert toman to rial
    const total = rate * subtotal * 10;
    const data = { ...form, total };
    dispatch({ type: 'set_order', data });
    setEditMode(false);
  };

  const createOrder = async () => {
    try {
      updateRate();
      dispatch({ type: 'set_loading', loading: true });
      const res = await fetch(
        `${orderApi.root}${orderApi.versionString}order`,
        {
          method: 'POST',
          headers: {
            'X-WP-Nonce': orderApi.nonce,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        }
      );
      const { message, ...data } = await res.json();
      if (res.ok) {
        handleCapture(() => {
          setEditMode(true);
          dispatch({ type: 'set_success', message, orderId: data.order_id });
        });
      } else {
        dispatch({ type: 'set_error', message });
      }
    } catch ({ message }) {
      dispatch({ type: 'set_error', message });
    }
  };

  if (!editMode)
    return <Invoice onEdit={() => setEditMode(true)} onSubmit={createOrder} />;

  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        TransitionComponent={Slide}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          variant="filled"
          severity="success"
          sx={{ width: '100%' }}
          icon={<DownloadingIcon fontSize="small" />}
        >
          در حال دانلود پیش فاکتور...
        </Alert>
      </Snackbar>
      <Box
        ref={form}
        method="post"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {Boolean(success) ? (
              <>
                <Button
                  fullWidth
                  color="success"
                  variant="outlined"
                  href={`https://www.rialir.com/account/view-order/${orderId}/`}
                  target="_blank"
                  sx={{ mb: 1 }}
                >
                  جزئیات سفارش شماره {persianNumber(orderId)}
                </Button>
                <Alert icon={<CheckIcon fontSize="small" />} severity="success">
                  <div dangerouslySetInnerHTML={{ __html: success }} />
                </Alert>
              </>
            ) : (
              <Typography variant="subtitle2" color="error" align="center">
                قبل از ثبت سفارش، آدرس خود را در صفحه&nbsp;
                <a
                  target="_blank"
                  href="https://www.rialir.com/account/edit-address/"
                >
                  آدرس ها
                </a>
                &nbsp;ثبت کنید.
              </Typography>
            )}
            <Button
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                append({ link: '', size: 'standard', description: '' })
              }
            >
              افزودن محصول به سفارش
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
                    ].map((size, key) => (
                      <option key={key} value={size}>
                        {size}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="سایز های متفرقه">
                    <option value="single">یک نفره</option>
                    <option value="double">دو نفره</option>
                  </optgroup>
                  <optgroup label="سایز های عددی">
                    {Array.from({ length: 80 }, (_, i) => (36 + i) / 2).map(
                      (size, key) => (
                        <option key={key} value={size}>
                          {size}
                        </option>
                      )
                    )}
                  </optgroup>
                </Input>
              </Grid>
              <Grid item xs={6}>
                <Input
                  required={false}
                  control={control}
                  label="رنگ یا کد محصول"
                  id={`products.${index}.description`}
                  name={`products.${index}.description`}
                  placeholder="مثال: رنگ Light blue"
                />
              </Grid>
            </React.Fragment>
          ))}
          <Grid item xs={12}>
            <Input
              control={control}
              name="subtotal"
              id="subtotal"
              label="قیمت کالاها به لیر + هزینه Kargo"
              placeholder="مثال: 7425.47₺ + هزینه Kargo"
              InputProps={{
                inputComponent: NumericFormat,
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
              multiline
              maxRows={4}
              control={control}
              name="description"
              id="description"
              label="توضیحات"
              placeholder="جزئیات دقیق سفارش را به فارسی بنویسید."
            />
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
                  name="postcode"
                  id="postcode"
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
        <LoadingButton
          fullWidth
          type="submit"
          size="large"
          variant="contained"
          loading={loading}
          disabled={Boolean(error)}
          sx={{ my: 2 }}
        >
          ثبت سفارش
        </LoadingButton>
        {Boolean(error) && (
          <Alert
            severity="error"
            icon={<ErrorIcon fontSize="small" />}
            action={
              <Button color="inherit" size="small" onClick={updateRate}>
                تلاش مجدد
              </Button>
            }
          >
            {error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
