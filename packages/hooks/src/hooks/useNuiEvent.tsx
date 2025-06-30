'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { NuiContextValue, NuiContext } from '../contexts/NuiContext';
import type { NuiEvent } from '../providers/NuiProvider';

export interface UseNuiEventOptions<T> {
    event: string;
    defaultValue?: T;
    context?: React.Context<NuiContextValue>;
    callback?: (data: T) => void;
}

type UseNuiEventReturn<T, HasDefault extends boolean> = {
    data: HasDefault extends true ? T : T | undefined;
};

export function useNuiEvent<T>(
    options: UseNuiEventOptions<T> & { defaultValue: T }
): UseNuiEventReturn<T, true>;

export function useNuiEvent<T>(options: UseNuiEventOptions<T>): UseNuiEventReturn<T, false>;

export function useNuiEvent<T>(options: UseNuiEventOptions<T>): UseNuiEventReturn<T, boolean> {
    const { event, defaultValue, context = NuiContext, callback } = options;

    const ctx = useContext(context);
    const [data, setData] = useState<T | undefined>(defaultValue);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!ctx) {
            throw new Error('useNuiEvent must be used inside a NuiProvider.');
        }

        if (!event) {
            throw new Error('useNuiEvent: No event name provided.');
        }

        const handler = (e: MessageEvent) => {
            const evt = e.data as NuiEvent<T>;
            setData(evt.payload);
            callbackRef.current?.(evt.payload);
        };

        ctx.addHandler(event, handler);
        return () => {
            ctx.removeHandler(event, handler);
        };
    }, [ctx, event]);

    return { data } as UseNuiEventReturn<T, boolean>;
}
