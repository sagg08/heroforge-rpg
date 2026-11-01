import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectEquippedIds, selectIsOverencumbered } from '../store/selectors';
import { clearEquipment, toggleEquipItem } from '../store/slices/inventorySlice';
import type { Item } from '../store/types';
import { colors, radius, spacing } from '../theme';
import { ZoneCard } from './ui/ZoneCard';

/**
 * ZONA C — Armería & Mochila.
 * Despacha a inventorySlice. NO despacha nada al log: actionLogSlice escucha
 * estas acciones por su cuenta con extraReducers (builder.addMatcher).
 */
export function ArmoryGrid() {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector((state) => state.inventory.catalog);
  const equippedIds = useAppSelector(selectEquippedIds);
  const isOverloaded = useAppSelector(selectIsOverencumbered);

  return (
    <ZoneCard zone="C" title="Armería & Mochila">
      {isOverloaded && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>⚠️ ¡SOBRECARGADO! (-50% Velocidad)</Text>
        </View>
      )}

      <View style={styles.grid}>
        {catalog.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            equipped={equippedIds.includes(item.id)}
            onPress={() => dispatch(toggleEquipItem(item.id))}
          />
        ))}
      </View>

      <Pressable
        disabled={equippedIds.length === 0}
        style={({ pressed }) => [
          styles.clearButton,
          equippedIds.length === 0 && styles.disabled,
          pressed && styles.pressed,
        ]}
        onPress={() => dispatch(clearEquipment())}
      >
        <Text style={styles.clearText}>🧺 Desequipar todo</Text>
      </Pressable>
    </ZoneCard>
  );
}

/** Formatea un bono con signo (+4 / -2). */
const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`);

/** Tarjeta de ítem: presentacional, recibe el ítem y un callback. */
function ItemCard({ item, equipped, onPress }: { item: Item; equipped: boolean; onPress: () => void }) {
  const bonuses = [
    { label: 'STR', value: item.bonusStr, color: colors.str },
    { label: 'AGI', value: item.bonusAgi, color: colors.agi },
    { label: 'INT', value: item.bonusInt, color: colors.int },
  ].filter((bonus) => bonus.value !== 0);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, equipped && styles.cardEquipped, pressed && styles.pressed]}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.bonusRow}>
        {bonuses.map((bonus) => (
          <Text
            key={bonus.label}
            style={[styles.bonus, { color: bonus.value > 0 ? bonus.color : colors.danger }]}
          >
            {signed(bonus.value)} {bonus.label}
          </Text>
        ))}
      </View>
      <Text style={styles.weight}>⚖️ {item.weight} kg</Text>
      {equipped && <Text style={styles.equippedTag}>EQUIPADO</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alert: {
    backgroundColor: '#450a0a',
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  alertText: { color: '#fecaca', fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'center',
  },
  // "Borde brillante" del ítem equipado
  cardEquipped: {
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.8,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  icon: { fontSize: 28 },
  name: { color: colors.text, fontWeight: '700', fontSize: 12, marginTop: 2 },
  bonusRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 2 },
  bonus: { fontSize: 11, fontWeight: '700' },
  weight: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  equippedTag: { color: colors.gold, fontSize: 10, fontWeight: '900', marginTop: 2 },
  clearButton: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearText: { color: colors.text, fontWeight: '700' },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.6 },
});
