import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Item } from './types';
import { MAX_HP } from './slices/statsSlice';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * REGLA DE ORO: nada de lo que se calcula aquí se guarda en un slice.
 * El estado guarda solo los DATOS MÍNIMOS (atributos base, ids equipados, HP);
 * todo lo demás se DERIVA. Si lo guardáramos, cada reducer tendría que acordarse
 * de recalcularlo y tarde o temprano dos valores se contradecirían en la UI.
 *
 * createSelector (Reselect) memoiza: solo recalcula cuando cambian sus entradas.
 * Si devuelve un objeto o arreglo, mantiene la MISMA referencia mientras las
 * entradas no cambien, y así los componentes no se re-renderizan sin necesidad.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ── Constantes de diseño del juego ──
export const CLASS_THRESHOLD = 15;
export const OVERLOAD_POWER_PENALTY = 0.7; // -30% de poder total
export const OVERLOAD_SPEED_PENALTY = 0.5; // -50% de velocidad
export const HEAVY_GEAR_WEIGHT = 20;
export const MANA_PER_INT = 10;
/** Tope visual de la barra de maná (INT máximo alcanzable aprox. 30). */
export const MAX_MANA_DISPLAY = 300;

// ── Selectores de entrada (leen el estado tal cual) ──
const selectStats = (state: RootState) => state.stats;
const selectCatalog = (state: RootState) => state.inventory.catalog;
export const selectEquippedIds = (state: RootState) => state.inventory.equippedIds;
export const selectAvailablePoints = (state: RootState) => state.stats.availablePoints;
export const selectCurrentHp = (state: RootState) => state.stats.currentHp;
export const selectActionLog = (state: RootState) => state.actionLog.entries;

/** Suma una propiedad numérica de una lista de ítems. */
const sumBy = (items: Item[], key: 'bonusStr' | 'bonusAgi' | 'bonusInt' | 'weight') =>
  items.reduce((acc, item) => acc + item[key], 0);

// ── Selectores derivados ──

/** Ítems equipados, reconstruidos a partir del catálogo + ids (cruce dentro de inventory). */
export const selectEquippedItems = createSelector(
  [selectCatalog, selectEquippedIds],
  (catalog, equippedIds) => catalog.filter((item) => equippedIds.includes(item.id)),
);

/** Atributos totales = base (statsSlice) + bonos equipados (inventorySlice). Cruza 2 slices. */
export const selectTotalStats = createSelector(
  [selectStats, selectEquippedItems],
  (stats, equipped) => ({
    str: Math.max(0, stats.str + sumBy(equipped, 'bonusStr')),
    agi: Math.max(0, stats.agi + sumBy(equipped, 'bonusAgi')),
    int: Math.max(0, stats.int + sumBy(equipped, 'bonusInt')),
  }),
);

export const selectTotalWeight = createSelector([selectEquippedItems], (equipped) =>
  sumBy(equipped, 'weight'),
);

/** Capacidad de carga = 10 + (Fuerza TOTAL * 2). */
export const selectMaxCarryCapacity = createSelector(
  [selectTotalStats],
  (total) => 10 + total.str * 2,
);

export const selectIsOverencumbered = createSelector(
  [selectTotalWeight, selectMaxCarryCapacity],
  (weight, capacity) => weight > capacity,
);

export type WeightLevel = 'light' | 'heavy' | 'overloaded';

/** Nivel de carga para colorear la barra: verde (<70%), amarillo (hasta 100%) o rojo. */
export const selectWeightLevel = createSelector(
  [selectTotalWeight, selectMaxCarryCapacity],
  (weight, capacity): WeightLevel => {
    if (weight > capacity) return 'overloaded';
    if (weight >= capacity * 0.7) return 'heavy';
    return 'light';
  },
);

/** Poder de combate: STR*3 + AGI*2 + INT*3, con -30% si está sobrecargado. */
export const selectCombatPower = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (total, isOverloaded) => {
    const rawPower = total.str * 3 + total.agi * 2 + total.int * 3;
    return isOverloaded ? Math.round(rawPower * OVERLOAD_POWER_PENALTY) : rawPower;
  },
);

/** Velocidad basada en agilidad; la sobrecarga la reduce a la mitad. */
export const selectMovementSpeed = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (total, isOverloaded) =>
    isOverloaded ? Math.round(total.agi * OVERLOAD_SPEED_PENALTY) : total.agi,
);

/** Maná máximo derivado de la inteligencia total. */
export const selectMaxMana = createSelector([selectTotalStats], (total) => total.int * MANA_PER_INT);

/** Daño que el Boss inflige por turno: más agilidad = más esquiva; sobrecarga = más daño recibido. */
export const selectIncomingBossDamage = createSelector(
  [selectTotalStats, selectIsOverencumbered],
  (total, isOverloaded) => {
    const baseDamage = Math.max(5, 30 - total.agi);
    return isOverloaded ? baseDamage + 10 : baseDamage;
  },
);

/** Primera arma equipada: es la que el avatar "lleva en la mano". */
export const selectEquippedWeapon = createSelector(
  [selectEquippedItems],
  (equipped) => equipped.find((item) => item.category === 'weapon') ?? null,
);

export type HeroCondition = 'healthy' | 'wounded' | 'critical' | 'defeated';

/** Estado vital según el porcentaje de HP: define la expresión del avatar. */
export const selectHeroCondition = createSelector([selectCurrentHp], (hp) => {
  const ratio = hp / MAX_HP;
  let condition: HeroCondition = 'healthy';
  let expression = '😄';
  if (hp <= 0) {
    condition = 'defeated';
    expression = '💀';
  } else if (ratio < 0.25) {
    condition = 'critical';
    expression = '😵';
  } else if (ratio < 0.6) {
    condition = 'wounded';
    expression = '😣';
  }
  return { condition, expression, isDefeated: condition === 'defeated' };
});

export interface HeroVisualClass {
  name: string;
  sprite: string;
  auraColor: string;
}

/**
 * Clase visual automática según el equipo y la estadística dominante:
 * 1. Equipo pesado (>= 20 kg)          → Tanque Pesado
 * 2. Atributo dominante >= 15          → Berserker / Archimago / Asesino
 * 3. Ninguno de los anteriores         → Aldeano
 */
export const selectHeroVisualClass = createSelector(
  [selectTotalStats, selectTotalWeight],
  (total, weight): HeroVisualClass => {
    if (weight >= HEAVY_GEAR_WEIGHT) {
      return { name: 'Tanque Pesado', sprite: '🛡️', auraColor: '#f59e0b' };
    }

    // Atributo dominante: el de mayor valor (en empate gana el orden STR > INT > AGI).
    const dominant = (['str', 'int', 'agi'] as const).reduce((best, key) =>
      total[key] > total[best] ? key : best,
    );

    if (total[dominant] >= CLASS_THRESHOLD) {
      if (dominant === 'str') return { name: 'Guerrero Berserker', sprite: '⚔️', auraColor: '#ef4444' };
      if (dominant === 'int') return { name: 'Archimago', sprite: '🔮', auraColor: '#3b82f6' };
      return { name: 'Asesino Sombrío', sprite: '🥷', auraColor: '#10b981' };
    }

    return { name: 'Aldeano', sprite: '🧑‍🌾', auraColor: '#94a3b8' };
  },
);
