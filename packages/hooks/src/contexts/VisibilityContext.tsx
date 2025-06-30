'use client';

import { createContext } from 'react';

export interface VisibilityContextValue {
    setVisible: (visile: boolean) => void;
    visible: boolean;
}

export const VisibilityContext = createContext<VisibilityContextValue>({
    setVisible: () => {
        console.error('Failed to set Nui visible. The context has not been initialized.');
    },
    visible: false
});
