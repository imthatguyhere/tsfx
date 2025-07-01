'use client';

import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { NuiVisibilityContext, NuiVisibilityContextValue } from '../contexts';
import { useNuiEvent } from '../hooks';
import { fetchNui } from '../services/fetchNui';
import { isDevBrowser } from '../services/isDevBrowser';

export interface NuiVisibilityProviderProps {
    debug?: boolean;
    context?: React.Context<NuiVisibilityContextValue>;
    hideKeys?: string[];
}

export const NuiVisibilityProvider: React.FC<PropsWithChildren<NuiVisibilityProviderProps>> = ({
    debug: debugEnabled,
    children,
    context = NuiVisibilityContext,
    hideKeys = ['Escape']
}) => {
    const [visible, setVisible] = useState<boolean>(false);

    useNuiEvent<boolean>('show', { callback: setVisible });

    const debug = useCallback(
        (...args: unknown[]) => {
            if (debugEnabled) {
                console.debug('[VisibilityProvider]', ...args);
            }
        },
        [debugEnabled]
    );

    useEffect(() => {
        if (!visible) {
            fetchNui('hide');
            return;
        }

        const keyHandler = (e: KeyboardEvent) => {
            if (hideKeys.includes(e.code)) {
                debug(`Hide key [${e.code}] pressed`);
                setVisible(!visible);

                if (!isDevBrowser()) {
                    fetchNui('hide');
                }
            }
        };

        window.addEventListener('keydown', keyHandler);

        return () => window.removeEventListener('keydown', keyHandler);
    }, [visible]);

    return <context.Provider value={{ visible, setVisible }}>{children}</context.Provider>;
};
