import React, { useContext } from 'react';
import moment from 'moment-jalaali';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { numFormat, persianNumber, tryFormat } from '../../utils';
import { AppContext } from '../../context';
import Logo from '../Logo';

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

export default function ShippingInvoice({ onEdit, onSubmit }) {
  const { order, pricing, loading, error, success } = useContext(AppContext);
  const incDsc = pricing.discount;
  const fee = parseInt(pricing.fee);

  return (
    <Box>
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
              <TableCell align="center">قیمت لحظه ای لیر</TableCell>
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
                  {numFormat(pricing.try)} تومان
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
                  {moment(pricing.date || new Date().getTime())
                    .zone('+0330')
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
              <TableCell align="center">سایز محصول</TableCell>
              <TableCell align="right">توضیحات</TableCell>
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
                <TableCell align="center">{product.size}</TableCell>
                <TableCell align="right">{product.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            مشخصات خریدار
          </Typography>
          <Typography gutterBottom>{orderApi?.full_name || '-'}</Typography>
          <Typography>{orderApi?.phone_number || '-'}</Typography>
        </Grid>
        <Divider flexItem orientation="vertical">
          <Logo />
        </Divider>
        <Grid item xs sx={{ py: 2 }}>
          <Typography align="center" variant="h6" gutterBottom>
            روش پرداخت
          </Typography>
          <Typography align="center" gutterBottom>
            شماره کارت بانک سامان
          </Typography>
          <Typography align="center" fontWeight={700} gutterBottom>
            6219&nbsp;8619&nbsp;0609&nbsp;8149
          </Typography>
          <Typography align="center">بنام مهرداد مهرعلیان</Typography>
        </Grid>
      </Grid>
      <Divider />
      <LoadingButton
        fullWidth
        loading={loading}
        disabled={success}
        onClick={onSubmit}
        size="large"
        variant="contained"
        sx={{ my: 2 }}
      >
        ثبت سفارش
      </LoadingButton>
      {Boolean(error) && (
        <Alert icon={<ErrorIcon />} severity="error">
          {error}
        </Alert>
      )}
      <ul style={{ paddingInlineStart: '1em' }}>
        <Typography component="li" fontWeight={700} gutterBottom>
          با ثبت سفارش، با{' '}
          <a href="https://www.rialir.com/terms/">شرایط و قوانین سایت</a> موافقت
          می‌کنید.
        </Typography>
        <Typography component="li" fontWeight={700} gutterBottom>
          در علت تراکنش ذکر شود: بابت پرداخت قرض و تادیه دیون
        </Typography>
        <Typography component="li" align="justify" fontWeight={700}>
          مدت زمان تحویل سفارش: ۲۰ تا ۳۰ روز کاری ترکیه بعد از تحویل کالا توسط
          فروشنده به دفتر ریالیر در استانبول
        </Typography>
      </ul>
    </Box>
  );
}
