'use client';

import { Context, useContext } from 'react';
import { NuiVisibilityContext, NuiVisibilityContextValue } from '../contexts';

export const useNuiVisibility = () =>
    useContext<NuiVisibilityContextValue>(
        NuiVisibilityContext as Context<NuiVisibilityContextValue>
    );
