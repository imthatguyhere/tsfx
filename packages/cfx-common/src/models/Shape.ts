import { Matrix } from './Matrix';

export enum ShapeTag {}

export abstract class Shape<T = unknown> {
    public abstract get tag(): ShapeTag;
    public abstract get name(): string;
    public abstract clone(): Shape;
    public abstract contains(other: Shape<unknown>): boolean;

    private _data: any;

    constructor() {}

    public translate(x: number, y: number): T {
        return this.transform(Matrix.IDENTITY.translate(x, y));
    }

    public rotate(angle: number, x: number = 0, y: number = 0): T {
        return this.transform(Matrix.IDENTITY.rotate(angle, x, y));
    }

    public scale(s: number): T;
    public scale(sx: number, sy: number): T;
    public scale(a: unknown, b?: unknown): T {
        return this.transform(Matrix.IDENTITY.scale(a as number, (b ?? a) as number));
    }

    public transform(_a: unknown): T {
        throw new Error('Abstract method cannot be invoked');
    }

    public toJSON(): { name: string } & Record<string, any> {
        return Object.assign({}, this, { name: this.name });
    }
}
