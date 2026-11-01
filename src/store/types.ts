/**
 * Tipos de dominio compartidos por toda la capa de estado.
 * Centralizarlos aquí evita que slices, selectores y componentes
 * declaren cada uno su propia versión (y terminen desincronizados).
 */

/** Claves de los atributos base que el jugador puede entrenar. */
export type StatKey = 'str' | 'agi' | 'int';

/** Builds predefinidos que reasignan todos los puntos en un solo dispatch. */
export type BuildPreset = 'WARRIOR' | 'MAGE' | 'ROGUE';

export type ItemCategory = 'weapon' | 'shield' | 'armor' | 'boots' | 'accessory';

/** Ítem del catálogo de la armería. Los bonos pueden ser negativos (ítems malditos). */
export interface Item {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  /** Peso en kilogramos. */
  weight: number;
}

/** Una entrada del monitor visual de Redux (Zona D). */
export interface LogEntry {
  /** Número secuencial: identifica la entrada y sirve como key en la lista. */
  id: number;
  /** El `type` real de la acción, ej. "inventory/toggleEquipItem". */
  type: string;
  /** Representación legible del payload, ej. "Espada de Fuego". */
  payloadLabel: string;
}
