import React, { useReducer } from 'react';
import { AppContext, AppDispatchContext } from './context';

const initialState = {
  error: null,
  success: null,
  orderId: null,
  loading: false,
  editMode: true,
  pricing: {
    try_irt: { sell: 0, fee: 0, shop: 0 },
    discountVal: '',
    discount: false,
    updated_at: null,
  },
  order: {
    subtotal: '',
    total: '',
    products: [{ link: '', size: 'standard', description: '' }],
    description: '',
    newAddress: false,
    mobile: '',
    zipCode: '',
    address: '',
  },
};

export default function AppProvider({ children }) {
  const [store, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={store}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

function appReducer(data, action) {
  switch (action.type) {
    case 'reset': {
      return initialState;
    }
    case 'set_order': {
      return { ...data, order: action.data, orderId: null, editMode: false };
    }
    case 'set_pricing': {
      return { ...data, pricing: action.data, loading: false };
    }
    case 'set_loading': {
      return { ...data, loading: action.loading, success: null, error: null };
    }
    case 'edit_mode': {
      return { ...data, editMode: true };
    }
    case 'set_success': {
      return {
        ...data,
        success: action.message,
        orderId: action.orderId,
        loading: false,
        error: null,
      };
    }
    case 'set_error': {
      return { ...data, error: action.message, success: null, loading: false };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
