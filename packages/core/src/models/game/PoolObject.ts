export abstract class PoolObject {
    private _handle: number;

    constructor(handle: number) {
        this._handle = handle;
    }

    public get handle(): number {
        return this._handle;
    }

    protected set handle(_handle: number) {
        this._handle = _handle;
    }

    public abstract exists(): boolean;
    public abstract delete(): void;
}
