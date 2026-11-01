import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

/**
 * Hooks tipados. Los componentes usan estos en lugar de useDispatch/useSelector
 * directos, así no tienen que repetir los tipos RootState/AppDispatch.
 * `.withTypes` es la forma recomendada desde react-redux 9.1
 * (reemplaza a TypedUseSelectorHook).
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
