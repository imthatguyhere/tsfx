export class FloatComparator {
    constructor(private _tolerance: number = 1e-6) {}

    public set tolerance(tolerance: number) {
        this._tolerance = tolerance;
    }

    public get tolerance(): number {
        return this._tolerance;
    }

    public equalsZero(x: number): boolean {
        return Math.abs(x) <= this._tolerance;
    }

    public equals(x: number, y: number): boolean {
        return Math.abs(x - y) <= this._tolerance;
    }

    public greaterThan(x: number, y: number): boolean {
        return x - y > this.tolerance;
    }

    public greaterThanOrEqual(x: number, y: number): boolean {
        return x - y >= -this.tolerance;
    }

    public lessThan(x: number, y: number): boolean {
        return x - y < -this.tolerance;
    }

    public lessThanOrEqual(x: number, y: number): boolean {
        return x - y <= this.tolerance;
    }
}

const DefaultComparator = new FloatComparator();

export const setTolerance = (t: number) => (DefaultComparator.tolerance = t);
export const getTolerance = () => DefaultComparator.tolerance;

export const isApproximatelyZero = (x: number) => DefaultComparator.equalsZero(x);
export const areApproximatelyEqual = (x: number, y: number) => DefaultComparator.equals(x, y);
export const isDefinitelyGreater = (x: number, y: number) => DefaultComparator.greaterThan(x, y);
export const isDefinitelyLess = (x: number, y: number) => DefaultComparator.lessThan(x, y);

export const isGreaterOrApproxEqual = (x: number, y: number) =>
    DefaultComparator.greaterThanOrEqual(x, y);

export const isLessOrApproxEqual = (x: number, y: number) =>
    DefaultComparator.lessThanOrEqual(x, y);
