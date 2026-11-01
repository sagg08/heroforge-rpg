import { StatusBar } from 'expo-status-bar';
import { Platform, ScrollView, StatusBar as RNStatusBar, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { HeroAvatarHUD } from './src/components/HeroAvatarHUD';
import { StatsControlPanel } from './src/components/StatsControlPanel';
import { ArmoryGrid } from './src/components/ArmoryGrid';
import { ReduxLiveInspector } from './src/components/ReduxLiveInspector';
import { colors, spacing } from './src/theme';

// Espacio superior para no quedar debajo de la barra de estado / notch.
const TOP_INSET = Platform.OS === 'android' ? (RNStatusBar.currentHeight ?? 24) : 50;

/**
 * Raíz de la app.
 * <Provider> pone el Store a disposición de TODO el árbol de componentes.
 * Las 4 zonas son HERMANAS y no reciben props: cada una se conecta al Store
 * por su cuenta con useAppSelector/useAppDispatch → cero prop drilling.
 */
export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.root}>
        <StatusBar style="light" />
        <Text style={styles.title}>⚔️ HeroForge RPG</Text>
        {/* stickyHeaderIndices: el HUD (índice 0) queda fijo arriba al hacer scroll,
            así siempre se ve cómo reacciona a lo que pasa en las otras zonas. */}
        <ScrollView
          contentContainerStyle={styles.content}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stickyHud}>
            <HeroAvatarHUD />
          </View>
          <StatsControlPanel />
          <ArmoryGrid />
          <ReduxLiveInspector />
        </ScrollView>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingTop: TOP_INSET },
  title: {
    color: colors.gold,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  content: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  // Fondo sólido para que el contenido que pasa por debajo no se vea a través del HUD fijo.
  stickyHud: { backgroundColor: colors.background },
});
