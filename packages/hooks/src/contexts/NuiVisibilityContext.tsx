'use client';

import { createContext } from 'react';

export interface NuiVisibilityContextValue {
    setVisible: (visile: boolean) => void;
    visible: boolean;
}

export const NuiVisibilityContext = createContext<NuiVisibilityContextValue>({
    setVisible: () => {
        console.error('Failed to set Nui visible. The context has not been initialized.');
    },
    visible: false
});
