import { EQ, EQ_0 } from '../utils/utils';
import { Matrix } from './Matrix';
import { Point } from './Point';
import { Shape, ShapeTag } from './Shape';
import { Vector } from './Vector';

export class Vector2 extends Vector {
    public static EMPTY = Object.freeze(new Vector2(0, 0));

    constructor(x?: unknown, y?: unknown) {
        super(0, 0);

        if (x === undefined && y === undefined) return;

        if (y === undefined) {
            if (
                Array.isArray(x) &&
                x.length === 2 &&
                typeof x[0] === 'number' &&
                typeof x[1] === 'number'
            ) {
                [this.x, this.y] = x;

                return;
            }

            if (x instanceof Object && (x as any).name === 'vector2') {
                const { x: _x, y: _y } = x as Vector2;
                this.x = _x;
                this.y = _y;

                return;
            }

            if (typeof x === 'number') {
                this.x = Math.cos(x);
                this.y = Math.sin(x);

                return;
            }
        }

        if (typeof x === 'number' && typeof y === 'number') {
            this.x = x;
            this.y = y;
            return;
        }

        if (x instanceof Point && y instanceof Point) {
            this.x = y.x - x.x;
            this.y = y.y - x.y;
            return;
        }

        throw new ReferenceError('Illegal Parameters');
    }

    public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public contains(_other: Shape<unknown>): boolean {
        throw new Error('Method not implemented.');
    }

    public get tag(): ShapeTag {
        return ShapeTag.Vector;
    }

    public get name(): string {
        return 'vector2';
    }

    public get center(): Point {
        return new Point(this.x / 2, this.y / 2);
    }

    public equalTo(vector: Vector2): boolean {
        return EQ(this.x, vector.x) && EQ(this.y, vector.y);
    }

    public cross(vector: Vector2): number {
        return this.x * vector.y - this.y * vector.x;
    }

    public dot(vector: Vector2): number {
        return this.x * vector.x + this.y * vector.y;
    }

    public get normalize(): Vector2 {
        if (!EQ_0(this.length)) {
            return new Vector2(this.x / this.length, this.y / this.length);
        }

        return new Vector2(0, 0);
    }

    public distance(vector: Vector2): number {
        return Math.sqrt(this.distanceSquared(vector));
    }

    public distanceSquared(vector: Vector2): number {
        const dx: number = this.x - vector.x;
        const dy: number = this.y - vector.y;

        return dx * dx + dy * dy;
    }

    public add(vector: Vector2 | number): Vector2 {
        if (typeof vector === 'number') {
            return new Vector2(this.x + vector, this.y + vector);
        }

        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    public override subtract(vector: Vector2 | number): Vector2 {
        if (typeof vector === 'number') {
            return new Vector2(this.x - vector, this.y - vector);
        }

        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    public override multiply(vector: Vector2 | number): Vector2 {
        if (typeof vector === 'number') {
            return new Vector2(this.x * vector, this.y * vector);
        }

        return new Vector2(this.x * vector.x, this.y * vector.y);
    }

    public override divide(vector: Vector2 | number): Vector2 {
        if (typeof vector === 'number') {
            return new Vector2(this.x / vector, this.y / vector);
        }

        return new Vector2(this.x / vector.x, this.y / vector.y);
    }

    public replace(vector: Vector2): void {
        this.x = vector.x;
        this.y = vector.y;
    }

    public invert(): Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    public transform(m: Matrix): Vector2 {
        return new Vector2(m.transform(this.x, this.y));
    }
}

export const vector2 = (x: any, y: any) => new Vector2(x, y);
