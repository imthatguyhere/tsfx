import { Shape } from './Shape';

export abstract class Vector extends Shape<Vector> {
    protected constructor(
        public x: number,
        public y: number
    ) {
        super();
    }

    public abstract get length(): number;
    public abstract get normalize(): Vector;
    public abstract equalTo(vector: Vector): boolean;
    public abstract distanceSquared(vector: Vector): number;
    public abstract distance(vector: Vector): number;
    public abstract cross(vector: Vector): Vector | number;
    public abstract dot(vector: Vector): number;
    public abstract add(vector: Vector | number): Vector;
    public abstract subtract(vector: Vector | number): Vector;
    public abstract multiply(vector: Vector | number): Vector;
    public abstract divide(vector: Vector | number): Vector;
    public abstract replace(vector: Vector): void;
    public abstract invert(): Vector;
}
