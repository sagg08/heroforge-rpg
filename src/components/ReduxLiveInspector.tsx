import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectActionLog,
  selectCombatPower,
  selectHeroCondition,
  selectIncomingBossDamage,
} from '../store/selectors';
import { healHero, takeDamage } from '../store/slices/statsSlice';
import { colors, monoFont, radius, spacing } from '../theme';
import { StatBar } from './ui/StatBar';
import { ZoneCard } from './ui/ZoneCard';

const BOSS_MAX_HP = 300;

/**
 * ZONA D — Arena de simulación + Inspector Redux en vivo.
 *
 * Decisión de arquitectura: la vida del Boss vive en useState LOCAL porque
 * ningún otro componente la necesita. La vida del HÉROE sí está en Redux,
 * porque la leen el avatar (Zona A) y la arena (Zona D) a la vez.
 */
export function ReduxLiveInspector() {
  const dispatch = useAppDispatch();
  const combatPower = useAppSelector(selectCombatPower);
  const incomingDamage = useAppSelector(selectIncomingBossDamage);
  const { isDefeated } = useAppSelector(selectHeroCondition);
  const log = useAppSelector(selectActionLog);

  // ── Estado local (solo de esta zona) ──
  const [bossHp, setBossHp] = useState(BOSS_MAX_HP);
  const [combatMessage, setCombatMessage] = useState('El Dragón Ancestral te espera...');

  const bossDefeated = bossHp <= 0;

  const handleAttack = () => {
    if (isDefeated || bossDefeated) return;
    const newBossHp = Math.max(0, bossHp - combatPower);
    setBossHp(newBossHp);

    if (newBossHp === 0) {
      setCombatMessage(`¡Golpe final de ${combatPower}! El Boss ha caído 🏆`);
      return;
    }
    // Contraataque del Boss: este dispatch sí viaja al Store (y aparece en la consola).
    dispatch(takeDamage(incomingDamage));
    setCombatMessage(`Infliges ${combatPower} de daño · El Boss te devuelve ${incomingDamage}`);
  };

  const handleHeal = () => {
    dispatch(healHero());
    setCombatMessage('Bebes una poción de vida ❤️');
  };

  const handleNewBoss = () => {
    setBossHp(BOSS_MAX_HP);
    setCombatMessage('Un nuevo Boss aparece en la arena 🐉');
  };

  return (
    <ZoneCard zone="D" title="Arena & Inspector Redux">
      {/* ── Arena de combate ── */}
      <View style={styles.arena}>
        <Text style={styles.boss}>{bossDefeated ? '💥' : '🐉'}</Text>
        <View style={styles.bossInfo}>
          <StatBar label="Dragón Ancestral" value={bossHp} max={BOSS_MAX_HP} color={colors.danger} />
          <Text style={styles.combatStats}>
            Tu poder: {combatPower} · Daño recibido/turno: {incomingDamage}
          </Text>
        </View>
      </View>
      <Text style={styles.message}>{isDefeated ? '☠️ Tu héroe ha caído. ¡Cúralo!' : combatMessage}</Text>

      <View style={styles.buttonRow}>
        <ArenaButton
          label="⚔️ Atacar"
          color="#7f1d1d"
          disabled={isDefeated || bossDefeated}
          onPress={handleAttack}
        />
        <ArenaButton label="❤️ Curar" color="#14532d" onPress={handleHeal} />
        <ArenaButton label="🐉 Nuevo" color={colors.surfaceAlt} onPress={handleNewBoss} />
      </View>

      {/* ── Consola visual de Redux ── */}
      <View style={styles.console}>
        <Text style={styles.consoleTitle}>{'>'} redux-live-inspector · últimas 5 acciones</Text>
        {log.length === 0 ? (
          <Text style={styles.consoleEmpty}>Esperando dispatch...</Text>
        ) : (
          log.map((entry, index) => (
            <Text
              key={entry.id}
              style={[styles.consoleLine, index === 0 && styles.consoleLatest]}
              numberOfLines={1}
            >
              #{entry.id} [{entry.type}] → {entry.payloadLabel}
            </Text>
          ))
        )}
      </View>
    </ZoneCard>
  );
}

function ArenaButton({
  label,
  color,
  disabled = false,
  onPress,
}: {
  label: string;
  color: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.arenaButton,
        { backgroundColor: color },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.arenaButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  arena: { flexDirection: 'row', alignItems: 'center' },
  boss: { fontSize: 42, marginRight: spacing.sm },
  bossInfo: { flex: 1 },
  combatStats: { color: colors.textMuted, fontSize: 11 },
  message: { color: colors.text, fontSize: 12, marginVertical: spacing.sm, fontStyle: 'italic' },
  buttonRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  arenaButton: { flex: 1, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center' },
  arenaButtonText: { color: colors.text, fontWeight: '800' },
  console: {
    backgroundColor: colors.console,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#1f2937',
    minHeight: 120,
  },
  consoleTitle: { color: colors.textMuted, fontFamily: monoFont, fontSize: 10, marginBottom: 4 },
  consoleEmpty: { color: '#4b5563', fontFamily: monoFont, fontSize: 11 },
  consoleLine: { color: '#65a30d', fontFamily: monoFont, fontSize: 11, marginBottom: 2 },
  consoleLatest: { color: colors.consoleText, fontWeight: '700' },
  disabled: { opacity: 0.35 },
  pressed: { opacity: 0.6 },
});
