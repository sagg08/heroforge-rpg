import { StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../store/hooks';
import {
  MAX_MANA_DISPLAY,
  selectCombatPower,
  selectCurrentHp,
  selectEquippedWeapon,
  selectHeroCondition,
  selectHeroVisualClass,
  selectMaxCarryCapacity,
  selectMaxMana,
  selectMovementSpeed,
  selectTotalStats,
  selectTotalWeight,
  selectWeightLevel,
  type WeightLevel,
} from '../store/selectors';
import { MAX_HP } from '../store/slices/statsSlice';
import { colors, radius, spacing } from '../theme';
import { StatBar } from './ui/StatBar';

const WEIGHT_COLORS: Record<WeightLevel, string> = {
  light: colors.success,
  heavy: colors.warning,
  overloaded: colors.danger,
};

/**
 * ZONA A — Avatar & HUD superior.
 * No tiene botones ni recibe props: SOLO lee el Store mediante selectores derivados.
 * Cualquier dispatch en las otras zonas se refleja aquí automáticamente.
 */
export function HeroAvatarHUD() {
  const heroClass = useAppSelector(selectHeroVisualClass);
  const { expression, isDefeated } = useAppSelector(selectHeroCondition);
  const weapon = useAppSelector(selectEquippedWeapon);
  const totals = useAppSelector(selectTotalStats);
  const hp = useAppSelector(selectCurrentHp);
  const maxMana = useAppSelector(selectMaxMana);
  const weight = useAppSelector(selectTotalWeight);
  const capacity = useAppSelector(selectMaxCarryCapacity);
  const weightLevel = useAppSelector(selectWeightLevel);
  const combatPower = useAppSelector(selectCombatPower);
  const speed = useAppSelector(selectMovementSpeed);

  const isOverloaded = weightLevel === 'overloaded';

  return (
    <View style={[styles.container, { borderColor: heroClass.auraColor }]}>
      <View style={styles.row}>
        {/* Avatar: el color del aura, el sprite y la expresión salen de selectores */}
        <View
          style={[
            styles.avatar,
            { borderColor: heroClass.auraColor, shadowColor: heroClass.auraColor },
            isDefeated && styles.avatarDefeated,
          ]}
        >
          <Text style={styles.sprite}>{isDefeated ? '🪦' : heroClass.sprite}</Text>
          <Text style={styles.expression}>{expression}</Text>
          {weapon && !isDefeated && <Text style={styles.weapon}>{weapon.icon}</Text>}
        </View>

        <View style={styles.info}>
          <View style={[styles.badge, { backgroundColor: heroClass.auraColor }]}>
            <Text style={styles.badgeText}>{isDefeated ? 'Derrotado' : heroClass.name}</Text>
          </View>
          <Text style={styles.totals}>
            <Text style={{ color: colors.str }}>STR {totals.str}</Text>
            {'  '}
            <Text style={{ color: colors.agi }}>AGI {totals.agi}</Text>
            {'  '}
            <Text style={{ color: colors.int }}>INT {totals.int}</Text>
          </Text>
          <Text style={styles.power}>
            ⚡ Poder {combatPower}
            <Text style={styles.speed}>   🏃 Vel. {speed}</Text>
          </Text>
          {isOverloaded && <Text style={styles.overloadTag}>¡SOBRECARGADO! (-30% poder)</Text>}
        </View>
      </View>

      <StatBar label="❤️ Vida (HP)" value={hp} max={MAX_HP} color={colors.hp} />
      <StatBar label="🔷 Maná" value={maxMana} max={MAX_MANA_DISPLAY} color={colors.mana} />
      <StatBar
        label="🎒 Carga"
        value={weight}
        max={capacity}
        color={WEIGHT_COLORS[weightLevel]}
        valueText={`${weight}/${capacity} kg`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 2,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra del color del aura (iOS usa shadow*, Android usa elevation)
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  avatarDefeated: { opacity: 0.45 },
  sprite: { fontSize: 34 },
  expression: { position: 'absolute', bottom: -4, left: -4, fontSize: 20 },
  weapon: { position: 'absolute', bottom: -4, right: -6, fontSize: 22 },
  info: { flex: 1, marginLeft: spacing.md },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginBottom: 4,
  },
  badgeText: { color: '#0b1020', fontWeight: '800', fontSize: 12 },
  totals: { fontSize: 12, fontWeight: '700', marginBottom: 2 },
  power: { color: colors.gold, fontSize: 13, fontWeight: '800' },
  speed: { color: colors.textMuted, fontWeight: '600' },
  overloadTag: { color: colors.danger, fontSize: 11, fontWeight: '800', marginTop: 2 },
});
