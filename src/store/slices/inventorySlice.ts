import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ITEM_CATALOG } from '../data/items';
import type { Item } from '../types';

export interface InventoryState {
  /** Catálogo completo de la armería. */
  catalog: Item[];
  /**
   * Solo guardamos los IDs equipados, no copias de los ítems.
   * Así el ítem tiene una única fuente de verdad (el catálogo) y los
   * selectores reconstruyen la lista de equipados cuando la necesitan.
   */
  equippedIds: string[];
}

const initialState: InventoryState = {
  catalog: ITEM_CATALOG,
  equippedIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    /** Equipa el ítem si no está equipado; lo desequipa si ya lo está. */
    toggleEquipItem(state, action: PayloadAction<string>) {
      const itemId = action.payload;
      const index = state.equippedIds.indexOf(itemId);

      if (index >= 0) {
        // Immer permite usar splice: por debajo se genera un arreglo nuevo.
        state.equippedIds.splice(index, 1);
        return;
      }

      // Validación defensiva: solo se pueden equipar ítems que existan en el catálogo.
      const exists = state.catalog.some((item) => item.id === itemId);
      if (exists) state.equippedIds.push(itemId);
    },

    /** Vacía todo el equipamiento activo de una sola vez. */
    clearEquipment(state) {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment } = inventorySlice.actions;

export default inventorySlice.reducer;
