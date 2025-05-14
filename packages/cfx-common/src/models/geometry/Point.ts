import { EQ, LT } from '../../utils/utils';
import { Matrix } from './Matrix';
import { Shape, ShapeTag } from './Shape';

export type PointLike = {
    x: number;
    y: number;
};

/**
 * @package https://github.com/romgrk/2d-geometry/blob/master/src/classes/Point.ts
 */
export class Point extends Shape<Point> {
    public static EMPTY = Object.freeze(new Point(0, 0));

    x: number;
    y: number;

    constructor();
    constructor(x: number, y: number);
    constructor(other: PointLike);
    constructor(other: [number, number]);
    constructor(a?: unknown, b?: unknown) {
        super();
        this.x = NaN;
        this.y = NaN;
        this.x = 0;
        this.y = 0;

        const argsLength = +(a !== undefined) + +(b !== undefined);

        if (argsLength === 0) {
            return;
        }

        if (argsLength === 1 && a instanceof Array) {
            this.x = a[0];
            this.y = a[1];
            return;
        }

        if (argsLength === 1) {
            let { x, y } = a as PointLike;
            this.x = x;
            this.y = y;
            return;
        }

        if (argsLength === 2) {
            this.x = a as number;
            this.y = b as number;
            return;
        }

        throw new ReferenceError('Illegal Parameters');
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public get tag(): ShapeTag {
        return ShapeTag.Point;
    }

    public get name(): string {
        return 'point';
    }

    public get center(): Point {
        return this;
    }

    public isEmpty(): boolean {
        return this.x === 0 && this.y === 0;
    }

    get vertices() {
        return [this];
    }

    public contains(other: Point): boolean {
        return this.equalTo(other);
    }

    public equalTo(pt: Point): boolean {
        return EQ(this.x, pt.x) && EQ(this.y, pt.y);
    }

    public lessThan(pt: Point): boolean {
        if (LT(this.y, pt.y)) return true;
        if (EQ(this.y, pt.y) && LT(this.x, pt.x)) return true;

        return false;
    }

    public transform(m: Matrix): Point {
        return new Point(m.transform(this.x, this.y));
    }

    public snapToGrid(grid: number): Point;
    public snapToGrid(xGrid: number, yGrid: number): Point;
    public snapToGrid(a: number = 1, b?: unknown): Point {
        const xGrid = a;
        const yGrid = b === undefined ? a : (b as number);

        return new Point(Math.round(this.x / xGrid) * xGrid, Math.round(this.y / yGrid) * yGrid);
    }

    public on(shape: Shape<any>): boolean {
        if (shape instanceof Point) {
            return this.equalTo(shape);
        }

        return shape.contains(this);
    }
}

export const point = (a: any, b: any) => new Point(a, b);
