import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  MAX_BASE_STAT,
  MIN_STAT,
  applyBuildPreset,
  decrementStat,
  incrementStat,
  resetStats,
} from '../store/slices/statsSlice';
import type { BuildPreset, StatKey } from '../store/types';
import { colors, radius, spacing } from '../theme';
import { StatBar } from './ui/StatBar';
import { ZoneCard } from './ui/ZoneCard';

const STAT_ROWS: { key: StatKey; label: string; color: string }[] = [
  { key: 'str', label: '💪 Fuerza (STR)', color: colors.str },
  { key: 'agi', label: '🌀 Agilidad (AGI)', color: colors.agi },
  { key: 'int', label: '🧠 Inteligencia (INT)', color: colors.int },
];

const PRESETS: { key: BuildPreset; label: string }[] = [
  { key: 'WARRIOR', label: '⚔️ Guerrero' },
  { key: 'MAGE', label: '🔮 Mago' },
  { key: 'ROGUE', label: '🥷 Pícaro' },
];

/**
 * ZONA B — Panel de entrenamiento.
 * Lee los atributos BASE (no los totales) y despacha acciones a statsSlice.
 * El componente no decide reglas: el reducer valida los límites; aquí
 * solo deshabilitamos botones para dar feedback visual.
 */
export function StatsControlPanel() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.stats);

  return (
    <ZoneCard zone="B" title="Panel de Entrenamiento">
      <View style={styles.pointsBox}>
        <Text style={styles.pointsLabel}>Puntos de habilidad disponibles</Text>
        <Text style={[styles.points, stats.availablePoints === 0 && styles.pointsEmpty]}>
          {stats.availablePoints}
        </Text>
      </View>

      {STAT_ROWS.map(({ key, label, color }) => (
        <View key={key} style={styles.statRow}>
          <RoundButton
            label="−"
            disabled={stats[key] <= MIN_STAT}
            onPress={() => dispatch(decrementStat(key))}
          />
          <View style={styles.barWrapper}>
            <StatBar label={label} value={stats[key]} max={MAX_BASE_STAT} color={color} />
          </View>
          <RoundButton
            label="+"
            disabled={stats.availablePoints <= 0}
            onPress={() => dispatch(incrementStat(key))}
          />
        </View>
      ))}

      <Text style={styles.sectionLabel}>Builds rápidos (1 dispatch = toda la UI cambia)</Text>
      <View style={styles.presetRow}>
        {PRESETS.map(({ key, label }) => (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.presetButton, pressed && styles.pressed]}
            onPress={() => dispatch(applyBuildPreset(key))}
          >
            <Text style={styles.presetText}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}
        onPress={() => dispatch(resetStats())}
      >
        <Text style={styles.resetText}>🧪 Poción de Reseteo</Text>
      </Pressable>
    </ZoneCard>
  );
}

/** Botón circular [-]/[+] interno de esta zona. */
function RoundButton({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.round, disabled && styles.roundDisabled, pressed && styles.pressed]}
    >
      <Text style={styles.roundText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pointsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  pointsLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  points: { color: colors.gold, fontSize: 24, fontWeight: '900' },
  pointsEmpty: { color: colors.textMuted },
  statRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  barWrapper: { flex: 1, marginHorizontal: spacing.sm },
  round: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundDisabled: { opacity: 0.3 },
  roundText: { color: colors.gold, fontSize: 18, fontWeight: '900' },
  sectionLabel: { color: colors.textMuted, fontSize: 11, marginTop: spacing.sm, marginBottom: spacing.xs },
  presetRow: { flexDirection: 'row', gap: spacing.sm },
  presetButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetText: { color: colors.text, fontWeight: '700', fontSize: 12 },
  resetButton: {
    marginTop: spacing.sm,
    backgroundColor: '#3b0764',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  resetText: { color: '#e9d5ff', fontWeight: '800' },
  pressed: { opacity: 0.6 },
});
