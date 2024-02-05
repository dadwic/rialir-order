import React, { useContext, useState } from 'react';
import * as yup from 'yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { AppContext, AppDispatchContext } from '../../context';
import Checkbox from '../Form/Checkbox';
import Input from '../Form/Input';
import Invoice from './Invoice';

const schema = yup
  .object({
    products: yup.array().of(
      yup.object().shape({
        name: yup.string().required('نام الزامی است.'),
        weight: yup.string().required('وزن/تعداد الزامی است.'),
      })
    ),
  })
  .required();

export default function PricingForm() {
  const { order } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const [editMode, setEditMode] = useState(true);
  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: order,
  });
  const { products } = watch();
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
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              fullWidth
              size="large"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => append({ name: '', weight: '', shoe: false })}
            >
              محصول جدید
            </Button>
          </Grid>
          {fields.map((field, index) => (
            <React.Fragment key={index}>
              <Grid item xs={6}>
                <Input
                  key={field.id}
                  id={field.id}
                  control={control}
                  name={`products.${index}.name`}
                  label="نام محصول"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" sx={{ mr: -1.5 }}>
                        <Tooltip title="کفش">
                          <Checkbox
                            edge="end"
                            color="primary"
                            id={`shoe-${index}`}
                            defaultChecked={products[index].shoe}
                            name={`products.${index}.shoe`}
                            control={control}
                          />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Input
                  key={field.id}
                  id={field.id}
                  control={control}
                  name={`products.${index}.weight`}
                  label={
                    products[index].shoe ? 'تعداد جفت کفش' : 'وزن محصول (گرم)'
                  }
                  type="tel"
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
            </React.Fragment>
          ))}
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
          محاسبه
        </Button>
      </Box>
    </Box>
  );
}
