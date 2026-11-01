import type { Item } from '../types';

/**
 * Catálogo inicial de la armería.
 *
 * Los pesos están pensados para la demo:
 * - Con FUERZA base 5 la capacidad es 10 + 5 * 2 = 20 kg.
 * - La Armadura Maldita sola (18 kg) deja la barra de peso en AMARILLO.
 * - Armadura + Escudo (27 kg) provoca SOBRECARGA (barra ROJA).
 * - Con el build WARRIOR (más fuerza) esa misma combinación ya no sobrecarga,
 *   lo que demuestra que la sobrecarga es un valor DERIVADO, no guardado.
 */
export const ITEM_CATALOG: Item[] = [
  { id: 'fire-sword', name: 'Espada de Fuego', icon: '🗡️', category: 'weapon', bonusStr: 4, bonusAgi: 0, bonusInt: 0, weight: 7 },
  { id: 'arcane-staff', name: 'Báculo Arcano', icon: '🪄', category: 'weapon', bonusStr: 0, bonusAgi: 0, bonusInt: 6, weight: 3 },
  { id: 'shadow-daggers', name: 'Dagas Sombrías', icon: '🔪', category: 'weapon', bonusStr: 0, bonusAgi: 5, bonusInt: 0, weight: 2 },
  { id: 'titan-shield', name: 'Escudo de Titanio', icon: '🛡️', category: 'shield', bonusStr: 1, bonusAgi: -1, bonusInt: 0, weight: 9 },
  { id: 'elven-boots', name: 'Botas Élficas', icon: '👢', category: 'boots', bonusStr: 0, bonusAgi: 4, bonusInt: 0, weight: 1 },
  { id: 'cursed-armor', name: 'Armadura Maldita', icon: '🦺', category: 'armor', bonusStr: 0, bonusAgi: -2, bonusInt: 0, weight: 18 },
  { id: 'mana-amulet', name: 'Amuleto de Maná', icon: '📿', category: 'accessory', bonusStr: 0, bonusAgi: 1, bonusInt: 3, weight: 1 },
];

/** Búsqueda rápida de nombre por id (la usa el log para mostrar payloads legibles). */
export const getItemName = (id: string): string =>
  ITEM_CATALOG.find((item) => item.id === id)?.name ?? id;
