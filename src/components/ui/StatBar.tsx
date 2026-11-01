import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  /** Texto a la derecha; por defecto "value/max". */
  valueText?: string;
  height?: number;
}

/**
 * Barra de progreso animada y PRESENTACIONAL: no conoce Redux.
 * Recibe números ya calculados por los selectores y solo los dibuja.
 * (Pasarle props a un componente hijo de la misma zona no es prop drilling:
 *  el antipatrón es atravesar varios niveles con datos que no se usan.)
 */
export function StatBar({ label, value, max, color, valueText, height = 10 }: StatBarProps) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;
  const progress = useRef(new Animated.Value(ratio)).current;

  // Cada vez que el valor cambia en el Store, animamos la barra hacia el nuevo porcentaje.
  useEffect(() => {
    Animated.timing(progress, {
      toValue: ratio,
      duration: 350,
      useNativeDriver: false, // width no se puede animar con el driver nativo
    }).start();
  }, [ratio, progress]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{valueText ?? `${value}/${max}`}</Text>
      </View>
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 6 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  label: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  value: { color: colors.text, fontSize: 11, fontWeight: '700' },
  track: { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.sm },
});
