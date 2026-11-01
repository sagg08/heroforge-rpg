# ⚔️ HeroForge RPG — Estado visual con Redux Toolkit

Taller de Desarrollo Móvil: mini-juego en React Native (Expo + TypeScript) donde cada `dispatch` hace reaccionar al mismo tiempo 4 zonas independientes de la pantalla.

## Ejecutar

```bash
npm install
npx expo start
```

Abre la app con Expo Go o en un emulador.

## Arquitectura

```
App.tsx                      <Provider store> + las 4 zonas (hermanas, sin props entre sí)
src/
├── store/                   Lógica de estado (Redux Toolkit)
│   ├── index.ts             configureStore, RootState, AppDispatch
│   ├── hooks.ts             useAppSelector / useAppDispatch tipados
│   ├── selectors.ts         Estado DERIVADO (createSelector) — nada calculado se guarda en slices
│   ├── types.ts             Tipos de dominio
│   ├── data/items.ts        Catálogo de la armería
│   └── slices/
│       ├── statsSlice.ts        Atributos, puntos y HP
│       ├── inventorySlice.ts    Catálogo + ids equipados
│       └── actionLogSlice.ts    Log automático vía extraReducers + addMatcher
├── components/              UI
│   ├── HeroAvatarHUD.tsx        Zona A · solo lee selectores
│   ├── StatsControlPanel.tsx    Zona B · despacha a statsSlice
│   ├── ArmoryGrid.tsx           Zona C · despacha a inventorySlice
│   ├── ReduxLiveInspector.tsx   Zona D · arena + consola de acciones
│   └── ui/                      StatBar (animada), ZoneCard
└── theme.ts                 Colores y espaciados
```

## Flujo de datos

`UI → dispatch(action) → reducer (Immer) → Store → selector (memoizado) → re-render`

## Reglas del juego (selectores)

| Valor derivado | Fórmula |
|---|---|
| Atributos totales | base + bonos de ítems equipados |
| Capacidad de carga | `10 + STR total × 2` |
| Sobrecarga | peso equipado > capacidad |
| Poder de combate | `STR×3 + AGI×2 + INT×3` (−30% si hay sobrecarga) |
| Velocidad | AGI total (−50% si hay sobrecarga) |
| Clase visual | ≥20 kg → Tanque Pesado · atributo dominante ≥15 → Berserker / Archimago / Asesino · si no, Aldeano |
