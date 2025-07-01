import { isDevBrowser } from './isDevBrowser';

export interface FetchNuiEventOptions<T> {
    payload?: unknown;
    debugReturn?: T;
}

export async function fetchNui<T = unknown>(
    event: string,
    options: FetchNuiEventOptions<T> = {}
): Promise<T | undefined> {
    const { payload, debugReturn } = options;

    if (isDevBrowser()) return debugReturn;

    const resourceName = (window as any).GetParentResourceName?.() ?? 'nui-frame-app';
    const controller = new AbortController();

    setTimeout(() => controller.abort(), 60000);

    try {
        const response: Response = await fetch(`https://${resourceName}/${event}`, {
            method: 'POST',
            body: JSON.stringify(payload ?? {}),
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        });

        if (!response.ok) {
            console.error(`fetchNui failed: ${response.status} ${response.statusText}`);
            return;
        }

        return await response.json();
    } catch (err) {
        console.error('fetchNui error:', err);
        return;
    }
}
