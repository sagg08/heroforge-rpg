import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BuildPreset, StatKey } from '../types';

// ── Reglas del juego (constantes exportadas para que la UI no las duplique) ──
export const BASE_STAT = 5;
export const MIN_STAT = 1;
export const TOTAL_SKILL_POINTS = 15;
export const MAX_HP = 100;
/** Valor máximo que puede alcanzar un atributo base (útil para dibujar barras). */
export const MAX_BASE_STAT = BASE_STAT + TOTAL_SKILL_POINTS;

export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
}

const initialState: StatsState = {
  availablePoints: TOTAL_SKILL_POINTS,
  str: BASE_STAT,
  agi: BASE_STAT,
  int: BASE_STAT,
  currentHp: MAX_HP,
};

/**
 * Distribución final de cada build. Cada fila suma 30 = 3 atributos * 5 base + 15 puntos,
 * así que al aplicar un preset los puntos disponibles quedan en 0.
 */
const BUILD_PRESETS: Record<BuildPreset, Record<StatKey, number>> = {
  WARRIOR: { str: 18, agi: 8, int: 4 },
  MAGE: { str: 4, agi: 8, int: 18 },
  ROGUE: { str: 6, agi: 18, int: 6 },
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    /**
     * Gasta 1 punto en el atributo indicado.
     * Gracias a Immer escribimos código "mutable" (state.x -= 1), pero RTK
     * produce por debajo un objeto NUEVO e inmutable.
     */
    incrementStat(state, action: PayloadAction<StatKey>) {
      if (state.availablePoints <= 0) return; // sin puntos: la acción no cambia nada
      state.availablePoints -= 1;
      state[action.payload] += 1;
    },

    /** Devuelve 1 punto a la reserva. Ningún atributo baja de MIN_STAT. */
    decrementStat(state, action: PayloadAction<StatKey>) {
      if (state[action.payload] <= MIN_STAT) return;
      state.availablePoints += 1;
      state[action.payload] -= 1;
    },

    /** Resta HP (nunca por debajo de 0). Ignora valores no positivos o no numéricos. */
    takeDamage(state, action: PayloadAction<number>) {
      const amount = action.payload;
      if (!Number.isFinite(amount) || amount <= 0) return;
      state.currentHp = Math.max(0, state.currentHp - amount);
    },

    /** Restaura la vida al máximo. No necesita payload. */
    healHero(state) {
      state.currentHp = MAX_HP;
    },

    /** Reasigna los 15 puntos de golpe: UNA acción transforma toda la interfaz. */
    applyBuildPreset(state, action: PayloadAction<BuildPreset>) {
      const preset = BUILD_PRESETS[action.payload];
      state.str = preset.str;
      state.agi = preset.agi;
      state.int = preset.int;
      state.availablePoints = 0;
    },

    /** "Poción de Reseteo": vuelve los atributos al inicio pero conserva el HP actual. */
    resetStats(state) {
      state.availablePoints = initialState.availablePoints;
      state.str = initialState.str;
      state.agi = initialState.agi;
      state.int = initialState.int;
    },
  },
});

// createSlice genera automáticamente un action creator por cada reducer.
// Su `type` es "<name>/<reducer>", ej. "stats/incrementStat".
export const { incrementStat, decrementStat, takeDamage, healHero, applyBuildPreset, resetStats } =
  statsSlice.actions;

export default statsSlice.reducer;
