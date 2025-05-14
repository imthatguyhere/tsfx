import { EQ, EQ_0 } from '../../utils/utils';
import { Point } from './Point';
import { Shape, ShapeTag } from './Shape';
import { Vector } from './Vector';

export class Vector4 extends Vector {
    public static EMPTY = Object.freeze(new Vector4(0, 0, 0, 0));

    z: number;
    w: number;

    constructor(x?: unknown, y?: unknown, z?: unknown, w?: unknown) {
        super(0, 0);
        this.z = 0;
        this.w = 0;

        if (x === undefined && y === undefined && z === undefined && w === undefined) return;

        if (y === undefined && z === undefined && w === undefined) {
            if (Array.isArray(x) && x.length === 4 && x.every((v) => typeof v === 'number')) {
                [this.x, this.y, this.z, this.w] = x;

                return;
            }

            if (x instanceof Object && (x as any).name === 'vector4') {
                const { x: _x, y: _y, z: _z, w: _w } = x as Vector4;
                this.x = _x;
                this.y = _y;
                this.z = _z;
                this.w = _w;

                return;
            }

            if (typeof x === 'number') {
                this.x = Math.cos(x);
                this.y = 0;
                this.z = Math.sin(x);
                this.w = 0;

                return;
            }
        }

        if (
            typeof x === 'number' &&
            typeof y === 'number' &&
            typeof z === 'number' &&
            typeof w === 'number'
        ) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;

            return;
        }

        throw new ReferenceError('Illegal Parameters');
    }

    public get normalize(): Vector4 {
        if (!EQ_0(this.length)) {
            return new Vector4(
                this.x / this.length,
                this.y / this.length,
                this.z / this.length,
                this.w / this.length
            );
        }

        return new Vector4(0, 0, 0, 0);
    }

    public equalTo(vector: Vector4): boolean {
        return (
            EQ(this.x, vector.x) &&
            EQ(this.y, vector.y) &&
            EQ(this.z, vector.z) &&
            EQ(this.w, vector.w)
        );
    }

    public distanceSquared(vector: Vector4): number {
        const w: Vector4 = this.subtract(vector);

        return this.dot(w);
    }

    public distance(vector: Vector4): number {
        return Math.sqrt(this.distanceSquared(vector));
    }

    public cross(vector: Vector4): Vector4 | number {
        const x: number = this.y * vector.z - this.z * vector.y;
        const y: number = this.z * vector.x - this.x * vector.z;
        const z: number = this.x * vector.y - this.y * vector.x;

        return new Vector4(x, y, z, 0);
    }

    public dot(vector: Vector4): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z + this.w * vector.w;
    }

    public override add(vector: Vector4 | number): Vector4 {
        if (typeof vector === 'number') {
            return new Vector4(this.x + vector, this.y + vector, this.z + vector, this.w + vector);
        }

        return new Vector4(
            this.x + vector.x,
            this.y + vector.y,
            this.z + vector.z,
            this.w + vector.w
        );
    }

    public override subtract(vector: Vector4 | number): Vector4 {
        if (typeof vector === 'number') {
            return new Vector4(this.x - vector, this.y - vector, this.z - vector, this.w - vector);
        }

        return new Vector4(
            this.x - vector.x,
            this.y - vector.y,
            this.z - vector.z,
            this.w - vector.w
        );
    }

    public override multiply(vector: Vector4 | number): Vector4 {
        if (typeof vector === 'number') {
            return new Vector4(this.x * vector, this.y * vector, this.z * vector, this.w * vector);
        }

        return new Vector4(
            this.x * vector.x,
            this.y * vector.y,
            this.z * vector.z,
            this.w * vector.w
        );
    }

    public override divide(vector: Vector4 | number): Vector4 {
        if (typeof vector === 'number') {
            return new Vector4(this.x / vector, this.y / vector, this.z / vector, this.w / vector);
        }

        return new Vector4(
            this.x / vector.x,
            this.y / vector.y,
            this.z / vector.z,
            this.w / vector.w
        );
    }

    public replace(vector: Vector4): void {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
        this.w = vector.w;
    }

    public invert(): Vector4 {
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    }

    public get tag(): ShapeTag {
        return ShapeTag.Vector;
    }

    public get name(): string {
        return 'vector4';
    }

    public get center(): Point {
        throw new Error('Method not implemented.');
    }

    public clone(): Vector4 {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    public contains(_other: Shape<unknown>): boolean {
        throw new Error('Method not implemented.');
    }
}
