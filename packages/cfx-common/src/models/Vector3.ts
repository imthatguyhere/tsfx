import { EQ, EQ_0 } from '../utils/utils';
import { Point } from './Point';
import { Shape, ShapeTag } from './Shape';
import { Vector } from './Vector';

export class Vector3 extends Vector {
    public static EMPTY = Object.freeze(new Vector3(0, 0, 0));

    z: number;

    constructor(x?: unknown, y?: unknown, z?: unknown) {
        super(0, 0);
        this.z = 0;

        if (x === undefined && y === undefined && z === undefined) return;

        if (y === undefined && z === undefined) {
            if (Array.isArray(x) && x.length === 3 && x.every((v) => typeof v === 'number')) {
                [this.x, this.y, this.z] = x;

                return;
            }

            if (x instanceof Object && (x as any).name === 'vector3') {
                const { x: _x, y: _y, z: _z } = x as Vector3;
                this.x = _x;
                this.y = _y;
                this.z = _z;

                return;
            }

            if (typeof x === 'number') {
                this.x = Math.cos(x);
                this.y = 0;
                this.z = Math.sin(x);

                return;
            }
        }

        if (typeof x === 'number' && typeof y === 'number' && typeof z === 'number') {
            this.x = x;
            this.y = y;
            this.z = z;

            return;
        }

        throw new ReferenceError('Illegal Parameters');
    }

    public get normalize(): Vector3 {
        if (!EQ_0(this.length)) {
            return new Vector3(this.x / this.length, this.y / this.length, this.z / this.length);
        }

        return new Vector3(0, 0, 0);
    }

    public equalTo(vector: Vector3): boolean {
        return EQ(this.x, vector.x) && EQ(this.y, vector.y) && EQ(this.z, vector.z);
    }

    public distanceSquared(vector: Vector3): number {
        const w: Vector3 = this.subtract(vector);

        return this.dot(w);
    }

    public distance(vector: Vector3): number {
        return Math.sqrt(this.distanceSquared(vector));
    }

    public cross(vector: Vector3): Vector3 | number {
        const x: number = this.y * vector.z - this.z * vector.y;
        const y: number = this.z * vector.x - this.z * vector.z;
        const z: number = this.x * vector.y - this.z * vector.x;

        return new Vector3(x, y, z);
    }

    public dot(vector: Vector3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    public override add(vector: Vector3 | number): Vector3 {
        if (typeof vector === 'number') {
            return new Vector3(this.x + vector, this.y + vector, this.z + vector);
        }

        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    public override subtract(vector: Vector3 | number): Vector3 {
        if (typeof vector === 'number') {
            return new Vector3(this.x - vector, this.y - vector, this.z - vector);
        }

        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    public override multiply(vector: Vector3 | number): Vector3 {
        if (typeof vector === 'number') {
            return new Vector3(this.x * vector, this.y * vector, this.z * vector);
        }

        return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
    }

    public override divide(vector: Vector3 | number): Vector3 {
        if (typeof vector === 'number') {
            return new Vector3(this.x / vector, this.y / vector, this.z / vector);
        }

        return new Vector3(this.x / vector.x, this.y / vector.y, this.z / vector.z);
    }

    public replace(vector: Vector3): void {
        this.x = vector.x;
        this.y = vector.y;
        this.z = vector.z;
    }

    public invert(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    public get tag(): ShapeTag {
        return ShapeTag.Vector;
    }

    public get name(): string {
        return 'vector3';
    }

    public get center(): Point {
        throw new Error('Method not implemented.');
    }

    public clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    public contains(_other: Shape<unknown>): boolean {
        throw new Error('Method not implemented.');
    }
}
