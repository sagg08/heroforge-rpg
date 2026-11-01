import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';
import { getItemName } from '../data/items';
import type { LogEntry } from '../types';
import {
  applyBuildPreset,
  decrementStat,
  healHero,
  incrementStat,
  resetStats,
  takeDamage,
} from './statsSlice';
import { clearEquipment, toggleEquipItem } from './inventorySlice';

/** Cuántas acciones muestra el inspector en pantalla. */
export const MAX_LOG_ENTRIES = 5;

export interface ActionLogState {
  entries: LogEntry[];
  /** Contador para numerar las acciones (#1, #2...). Es determinista: nada de Date.now(). */
  nextId: number;
}

const initialState: ActionLogState = {
  entries: [],
  nextId: 1,
};

/**
 * Matcher que reconoce TODAS las acciones de los otros dos slices.
 * isAnyOf combina los action creators en una sola función (action) => boolean.
 */
const isTrackedAction = isAnyOf(
  incrementStat,
  decrementStat,
  takeDamage,
  healHero,
  applyBuildPreset,
  resetStats,
  toggleEquipItem,
  clearEquipment,
);

/** Convierte el payload en texto legible para la consola visual. */
const formatPayload = (action: PayloadAction<unknown>): string => {
  // Para el inventario el payload es un id: mostramos el nombre del ítem.
  if (toggleEquipItem.match(action)) return `"${getItemName(action.payload)}"`;
  if (action.payload === undefined) return '(sin payload)';
  return JSON.stringify(action.payload);
};

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState,
  // Este slice NO tiene reducers propios: nadie despacha "actionLog/...".
  reducers: {},
  /**
   * extraReducers permite que un slice reaccione a acciones que pertenecen a
   * OTROS slices. Cada vez que se despacha una acción rastreada, el store la
   * envía a todos los reducers, y este la registra automáticamente.
   */
  extraReducers: (builder) => {
    builder.addMatcher(isTrackedAction, (state, action) => {
      state.entries.unshift({
        id: state.nextId,
        type: action.type,
        payloadLabel: formatPayload(action),
      });
      state.nextId += 1;

      // Mantener solo las últimas N acciones.
      if (state.entries.length > MAX_LOG_ENTRIES) {
        state.entries.length = MAX_LOG_ENTRIES;
      }
    });
  },
});

export default actionLogSlice.reducer;
