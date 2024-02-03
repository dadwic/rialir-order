import React, { useReducer } from 'react';
import { AppContext, AppDispatchContext } from './context';

export default function AppProvider({ children }) {
  const [store, dispatch] = useReducer(appReducer, {
    order: {
      subtotal: '',
      invoiceTotal: '',
      products: [{ name: '', weight: '', shoe: false }],
      description: '',
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
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
