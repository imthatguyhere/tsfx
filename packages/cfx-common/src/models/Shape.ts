import { Matrix } from './Matrix';
import { Point, PointLike } from './Point';

export type AnyShape = Shape<unknown>;

const ORIGIN_POINT: PointLike = {
    x: 0,
    y: 0
};

export enum ShapeTag {
    Point,
    Vector
}

export abstract class Shape<T = unknown> {
    public abstract get tag(): ShapeTag;
    public abstract get name(): string;
    public abstract get center(): Point;
    public abstract clone(): Shape;
    public abstract contains(other: Shape<unknown>): boolean;

    private _data: any;

    constructor() {}

    public translate(p: { x: number; y: number }): T;
    public translate(x: number, y: number): T;
    public translate(a: unknown, b?: unknown): T {
        return this.transform(Matrix.IDENTITY.translate(a as any, b as any));
    }

    public rotate(angle: number, center: PointLike = ORIGIN_POINT): T {
        return this.transform(Matrix.IDENTITY.rotate(angle, center.x, center.y));
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
