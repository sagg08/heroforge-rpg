import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

interface ZoneCardProps {
  /** Letra de la zona (A, B, C, D) para identificarla en el video. */
  zone: string;
  title: string;
  children: ReactNode;
}

/** Contenedor visual común para las 4 zonas. Solo estilo, sin lógica. */
export function ZoneCard({ zone, title, children }: ZoneCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        <Text style={styles.zone}>ZONA {zone} · </Text>
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: { color: colors.text, fontSize: 15, fontWeight: '800', marginBottom: spacing.sm },
  zone: { color: colors.gold },
});
