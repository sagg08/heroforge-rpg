import { configureStore } from '@reduxjs/toolkit';
import statsReducer from './slices/statsSlice';
import inventoryReducer from './slices/inventorySlice';
import actionLogReducer from './slices/actionLogSlice';

/**
 * El Store: única fuente de verdad de la app.
 * configureStore combina los reducers y además activa por defecto:
 * - Redux DevTools,
 * - el middleware de thunks,
 * - chequeos en desarrollo que detectan mutaciones accidentales y valores no serializables.
 */
export const store = configureStore({
  reducer: {
    stats: statsReducer,
    inventory: inventoryReducer,
    actionLog: actionLogReducer,
  },
});

/** Forma completa del estado global, inferida a partir de los reducers. */
export type RootState = ReturnType<typeof store.getState>;
/** Tipo del dispatch, para despachar acciones con autocompletado y tipado. */
export type AppDispatch = typeof store.dispatch;
