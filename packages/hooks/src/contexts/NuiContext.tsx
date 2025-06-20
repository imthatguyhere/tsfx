import { createContext } from 'react';
import { NuiEvent } from '../providers/NuiProvider';

export interface INuiContext {
    addHandler<T = unknown>(event: string, handler: (event: NuiEvent<T>) => void): void;
    removeHandler(event: string, handler: (event: unknown) => void): void;
}

export const NuiContext = createContext<INuiContext>({
    addHandler: () =>
        console.error('Failed to add NUI event. Nui Context has not been initialized!'),
    removeHandler: () =>
        console.error('Failed to remove NUI event. Nui Context has not been initialized!')
});
