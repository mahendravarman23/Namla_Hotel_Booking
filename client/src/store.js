import { configureStore } from '@reduxjs/toolkit';
import hotelsReducer from './features/hotels/hotelsSlice';
import uiReducer from './features/ui/uiSlice';
import authReducer from './features/auth/authSlice';

export default configureStore({
  reducer: {
    hotels: hotelsReducer,
    ui: uiReducer,
    auth: authReducer,
  },
});
