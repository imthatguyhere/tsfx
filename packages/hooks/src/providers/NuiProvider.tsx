export interface NuiEvent<T> {
    type: string;
    resource: string;
    payload: T;
}