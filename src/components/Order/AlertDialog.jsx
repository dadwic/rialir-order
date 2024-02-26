import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <WarningIcon color="primary" sx={{ mr: 1 }} />
        پیام‌های مهم
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          component="div"
          id="alert-dialog-description"
          sx={{
            ul: { paddingInlineStart: 2 },
            li: { fontWeight: 600, color: '#000' },
          }}
        >
          <ul>
            <Typography component="li" gutterBottom>
              با ثبت سفارش، با&nbsp;
              <a target="_blank" href="https://www.rialir.com/terms/">
                شرایط و قوانین ریالیر
              </a>
              &nbsp;موافقت می‌کنید.
            </Typography>
            <Typography component="li" gutterBottom>
              قبل از ثبت سفارش، از پیش فاکتور بصورت کامل اسکرین شات بگیرید.
            </Typography>
            <Typography component="li" gutterBottom>
              در توضیحات تراکنش ذکر شود: بابت پرداخت قرض و تادیه دیون
            </Typography>
            <Typography component="li" align="justify" gutterBottom>
              لطفا دقت فرمایید هزینه کارگو سایت مورد نظر به قیمت کالاها اضافه
              شود، در غیر این صورت سفارش شما تایید نخواهد شد.
            </Typography>
          </ul>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          size="large"
          variant="contained"
          onClick={handleClose}
          autoFocus
          fullWidth
        >
          تایید میکنم
        </Button>
      </DialogActions>
    </Dialog>
  );
}
