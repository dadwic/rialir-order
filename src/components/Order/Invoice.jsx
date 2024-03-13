import React, { useContext, useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import moment from 'moment-jalaali';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadingIcon from '@mui/icons-material/Downloading';
import { numFormat, persianNumber, tryFormat } from '../../utils';
import { AppContext, AppDispatchContext } from '../../context';
import AlertDialog from './AlertDialog';
import Logo from '../Logo';

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

export default function Invoice({ onEdit }) {
  const ref = useRef(null);
  const dispatch = useContext(AppDispatchContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { order, pricing, loading, error, success, orderId } =
    useContext(AppContext);
  const incDsc = pricing.discount;
  const fee = parseInt(pricing.fee);

  useEffect(() => {
    document.getElementById('order-app').scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleCapture = () => {
    setSnackbarOpen(true);
    toPng(ref.current, {
      cacheBust: true,
      quality: 1,
    }).then((dataUrl) => {
      var link = document.createElement('a');
      link.download = 'rialir-invoice.png';
      link.target = '_blank';
      link.href = dataUrl;
      link.click();
    });
  };

  const handleSubmit = async () => {
    if (
      window.confirm(
        'اگر از پیش فاکتور بصورت کامل اسکرین شات گرفته اید، روی OK کلیک کنید.'
      )
    ) {
      try {
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
        const { message, orderId } = await res.json();
        if (res.ok) {
          dispatch({ type: 'set_success', message, orderId });
          handleCapture();
        } else {
          dispatch({ type: 'set_error', message });
        }
      } catch ({ message }) {
        dispatch({ type: 'set_error', message });
      }
    }
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box p={2} ref={ref} bgcolor="white">
      <AlertDialog />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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
      {Boolean(success) && (
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
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div style={{ width: 48 }} />
        <div>
          <Typography
            variant="h6"
            textAlign="center"
            fontWeight={700}
            sx={{ mt: 2 }}
            gutterBottom
          >
            پیش فاکتور
          </Typography>
          <Typography
            variant="subtitle2"
            textAlign="center"
            color="text.secondary"
          >
            {moment().zone('+0330').format('dddd jD jMMMM jYYYY - HH:mm')}
          </Typography>
        </div>
        <IconButton
          onClick={onEdit}
          disabled={loading}
          size="large"
          color="primary"
        >
          <ArrowBackIcon />
        </IconButton>
      </Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">قیمت لیر</TableCell>
              <TableCell align="center">کارمزد خرید</TableCell>
              <TableCell align="center">قابل پرداخت</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              'tr:nth-of-type(odd)': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <TableRow>
              <TableCell
                align="center"
                sx={{
                  borderRight: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="subtitle2">
                  {numFormat(pricing.try_irt)} تومان
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{ borderRight: '1px solid #e0e0e0' }}
              >
                <Typography variant="subtitle2">
                  {persianNumber(incDsc ? fee * 0.75 : fee)} تومان
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="subtitle2" fontWeight={700}>
                  {numFormat(order.total)} ریال
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell colSpan={incDsc ? 2 : 3}>
                <Typography variant="subtitle2">
                  قیمت کالاها: {tryFormat(order.subtotal)} لیر
                </Typography>
              </TableCell>
              {incDsc && (
                <TableCell sx={{ borderLeft: '1px solid #e0e0e0', px: 1 }}>
                  <Typography variant="subtitle2">
                    تخفیف: {numFormat(pricing.discountVal)} تومان
                  </Typography>
                </TableCell>
              )}
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  تاریخ بروزرسانی‌ قیمت لیر:&nbsp;
                  {moment
                    .unix(pricing.time || new Date().getTime())
                    .format('jYYYY/jMM/jDD - HH:mm:ss')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>لینک محصول</TableCell>
              <TableCell
                align="center"
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                توضیحات
              </TableCell>
              <TableCell align="right">سایز</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              'tr:nth-of-type(odd)': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
              '&:last-child td, &:last-child th': { border: 0 },
            }}
          >
            {order.products.map((product, key) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {new URL(product.link).hostname}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  {product.description || '-'}
                </TableCell>
                <TableCell align="right">{product.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid
          item
          sm
          xs={12}
          sx={{
            py: 2,
            textAlign: { xs: 'center', sm: 'center', md: 'left' },
            borderBottomWidth: { xs: 1, sm: 0 },
            borderBottomStyle: 'solid',
            borderBottomColor: (t) => t.palette.divider,
          }}
        >
          <Typography variant="h6" gutterBottom>
            مشخصات خریدار
          </Typography>
          <Typography gutterBottom>{orderApi?.full_name || '-'}</Typography>
          <Typography gutterBottom>{orderApi?.phone_number || '-'}</Typography>
        </Grid>
        <Divider
          flexItem
          orientation="vertical"
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          <Logo />
        </Divider>
        <Grid item sm xs={12} sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            روش پرداخت
          </Typography>
          <Typography gutterBottom>شماره کارت بانک سامان</Typography>
          <Typography fontWeight={700} sx={{ direction: 'rtl' }} gutterBottom>
            6219&nbsp;8619&nbsp;0609&nbsp;8149
          </Typography>
          <Typography>بنام مهرداد مهرعلیان</Typography>
        </Grid>
      </Grid>
      <Divider sx={{ display: { xs: 'none', sm: 'block' } }} />
      <LoadingButton
        fullWidth
        disabled={Boolean(success)}
        loading={loading || snackbarOpen}
        onClick={handleSubmit}
        size="large"
        variant="contained"
        sx={{ my: 2 }}
      >
        ثبت سفارش
      </LoadingButton>
      {Boolean(error) && (
        <Alert icon={<ErrorIcon />} sx={{ mb: 2 }} severity="error">
          {error}
        </Alert>
      )}
      <Box sx={{ '& p': { fontWeight: 700 } }}>
        <Typography gutterBottom>توضیحات: {order.description}</Typography>
        <Typography gutterBottom>
          با ثبت سفارش،&nbsp;
          <a target="_blank" href="https://www.rialir.com/terms/">
            شرایط و قوانین ریالیر
          </a>
          &nbsp;را می‌پذیرید.
        </Typography>
        <Typography gutterBottom>
          در توضیحات تراکنش ذکر شود: بابت پرداخت قرض و تادیه دیون
        </Typography>
        <Typography>
          مدت زمان تحویل سفارش: ۲۰ تا ۳۰ روز کاری ترکیه بعد از تحویل کالا توسط
          فروشنده به دفتر ریالیر در استانبول
        </Typography>
      </Box>
    </Box>
  );
}
