import React, { useReducer } from 'react';
import { AppContext, AppDispatchContext } from './context';

export default function AppProvider({ children }) {
  const [store, dispatch] = useReducer(appReducer, {
    error: '',
    success: '',
    loading: false,
    order: {
      subtotal: '',
      invoiceTotal: '',
      products: [{ link: '', size: 'standard', description: '' }],
      description: '',
      newAddress: false,
      mobile: '',
      zipCode: '',
      address: '',
    },
  });

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
    case 'set_order': {
      return { ...data, order: action.data };
    }
    case 'loading': {
      return { ...data, loading: true, error: '', success: '' };
    }
    case 'set_error': {
      return { ...data, error: action.message, success: '', loading: false };
    }
    case 'set_success': {
      return { ...data, success: action.message, error: '', loading: false };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
