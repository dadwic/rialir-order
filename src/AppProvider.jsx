import React, { useReducer } from 'react';
import { AppContext, AppDispatchContext } from './context';

const initialState = {
  error: '',
  success: false,
  loading: false,
  pricing: {
    try: '0',
    fee: '200',
    discountVal: '',
    discount: false,
    date: null,
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
      return { ...data, order: action.data };
    }
    case 'set_pricing': {
      return { ...data, pricing: action.data, loading: false };
    }
    case 'loading': {
      return { ...data, loading: true, success: false, error: '' };
    }
    case 'success': {
      return {
        ...initialState,
        success: true,
        loading: false,
        error: '',
      };
    }
    case 'set_error': {
      return { ...data, error: action.message, success: false, loading: false };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
