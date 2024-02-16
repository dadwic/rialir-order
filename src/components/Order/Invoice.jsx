import React, { useContext } from 'react';
import moment from 'moment-jalaali';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/ErrorOutline';
import { numFormat, persianNumber } from '../../utils';
import { AppContext } from '../../context';
import Logo from '../Logo';

moment.loadPersian({ usePersianDigits: true, dialect: 'persian-modern' });

export default function ShippingInvoice({ onEdit, onSubmit }) {
  const { order, loading, error, success } = useContext(AppContext);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <LoadingButton loading={loading} onClick={onEdit} variant="contained">
          ویرایش سفارش
        </LoadingButton>
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
        <LoadingButton loading={loading} onClick={onSubmit} variant="contained">
          ثبت سفارش
        </LoadingButton>
      </Stack>
      {Boolean(success) && (
        <Alert icon={<CheckIcon />} severity="success">
          {success}
        </Alert>
      )}
      {Boolean(error) && (
        <Alert icon={<ErrorIcon />} severity="error">
          {error}
        </Alert>
      )}
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width={40}>ردیف</TableCell>
              <TableCell>سایت محصول</TableCell>
              <TableCell align="right">رنگ محصول</TableCell>
              <TableCell align="right">سایز محصول</TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              'tr:nth-of-type(odd)': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            {order.products.map((product, index) => (
              <TableRow key={product.name}>
                <TableCell>{persianNumber(index + 1)}</TableCell>
                <TableCell component="th" scope="row">
                  {new URL(product.link).hostname}
                </TableCell>
                <TableCell align="right">{product.color}</TableCell>
                <TableCell align="right">{product.size}</TableCell>
              </TableRow>
            ))}
            <TableRow
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
              }}
            >
              <TableCell colSpan={3}>
                <Typography variant="subtitle2">
                  مبلغ کل سفارش: {numFormat(order.subtotal)} لیر
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            مشخصات خریدار
          </Typography>
          <Typography gutterBottom>-</Typography>
          <Typography>-</Typography>
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
      <Divider sx={{ mb: 2 }} />
      <ul style={{ paddingInlineStart: '1em' }}>
        <Typography component="li" fontWeight={700} gutterBottom>
          با ثبت سفارش، با شرایط و قوانین سایت موافقت می‌کنید.
        </Typography>
        <Typography component="li" fontWeight={700} gutterBottom>
          در علت تراکنش ذکر شود: بابت پرداخت قرض و تادیه دیون
        </Typography>
        <Typography
          component="li"
          align="justify"
          fontWeight={700}
          gutterBottom
        >
          مشتری گرامی بعد از پرداخت، لطفاً تصویر فیش واریزی را به ربات تلگرام
          ریالیر ارسال کنید.
        </Typography>
        <Typography component="li" align="justify" fontWeight={700}>
          مدت زمان تحویل سفارش: ۴ تا ۶ هفته کاری بعد از تحویل کالا توسط فروشنده
          به دفتر ریالیر در استانبول
        </Typography>
      </ul>
    </Box>
  );
}
