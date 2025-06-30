'use client';

import { createContext } from 'react';

export interface NuiContextValue {
    addHandler(event: string, handler: (event: MessageEvent) => void): void;
    removeHandler(event: string, handler: (event: MessageEvent) => void): void;
}

export const NuiContext = createContext<NuiContextValue>({
    addHandler: () => {
        console.error('Failed to add Nui Event. The context has not been initialized.');
    },
    removeHandler: () => {
        console.error('Failed to remove Nui Event. The context has not been initialized.');
    }
});
