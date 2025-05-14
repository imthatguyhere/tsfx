import { EQ } from '../../utils/utils';
import { PointLike } from './Point';

const det = (a: number, b: number, c: number, d: number) => a * d - b * c;

/**
 * Class representing an affine transformation 3x3 matrix:
 * <pre>
 *      [ a  c  tx
 * A =    b  d  ty
 *        0  0  1  ]
 * </pre>
 * @type {Matrix}
 * @package https://github.com/romgrk/2d-geometry
 */
export class Matrix {
    private _inverse: Matrix | null;

    public static EMPTY = Object.freeze(new Matrix(0, 0, 0, 0, 0, 0));
    public static IDENTITY = Object.freeze(new Matrix(1, 0, 0, 1, 0, 0));

    public static fromTransform(x: number, y: number, rotation: number, scale: number): Matrix {
        return new Matrix(
            +scale * Math.cos(rotation),
            +scale * Math.sin(rotation),
            -scale * Math.sin(rotation),
            -scale * Math.cos(rotation),
            x,
            y
        );
    }

    /**
     * Construct new instance of affine transformation matrix <br/>
     * If parameters omitted, construct identity matrix a = 1, d = 1
     * @param a - position(0,0)   sx*cos(alpha)
     * @param b - position (0,1)  sx*sin(alpha)
     * @param c - position (1,0)  -sy*sin(alpha)
     * @param d - position (1,1)  sy*cos(alpha)
     * @param tx - position (2,0) translation by x
     * @param ty - position (2,1) translation by y
     */
    constructor(
        public a: number = 1,
        public b: number = 0,
        public c: number = 0,
        public d: number = 1,
        public tx: number = 0,
        public ty: number = 0
    ) {
        this._inverse = null;
    }

    public clone(): Matrix {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    public get inverse(): Matrix {
        const inverse = (this._inverse ??= this.invert());
        inverse._inverse = this;
        return inverse;
    }

    public invert(): Matrix {
        return this.clone().invertMut();
    }

    public invertMut(): this {
        this._inverse = null;

        const a = this.a;
        const b = this.c;
        const c = this.tx;
        const d = this.b;
        const e = this.d;
        const f = this.ty;
        const g = 0;
        const h = 0;
        const i = 1;

        const D = this.determinant();

        const ai = det(e, f, h, i) / D;
        const ci = -det(b, c, h, i) / D;
        const txi = det(b, c, e, f) / D;
        const bi = -det(d, f, g, i) / D;
        const di = det(a, c, g, i) / D;
        const tyi = -det(a, c, d, f) / D;

        this.a = ai;
        this.b = bi;
        this.c = ci;
        this.d = di;
        this.tx = txi;
        this.ty = tyi;

        return this;
    }

    public determinant(): number {
        const a = this.a;
        const b = this.c;
        const c = this.tx;
        const d = this.b;
        const e = this.d;
        const f = this.ty;
        const g = 0;
        const h = 0;
        const i = 1;

        return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    }

    /**
     * Transform vector [x,y] using transformation matrix. <br/>
     * Vector [x,y] is an abstract array[2] of numbers and not a FlattenJS object <br/>
     * The result is also an abstract vector [x',y'] = A * [x,y]:
     * <code>
     * [x'       [ ax + by + tx
     *  y'   =     cx + dy + ty
     *  1]                    1 ]
     * </code>
     */
    public transform(x: number, y: number): [number, number] {
        return [x * this.a + y * this.c + this.tx, x * this.b + y * this.d + this.ty];
    }

    public transformMut(p: PointLike): PointLike {
        p.x = p.x * this.a + p.y * this.c + this.tx;
        p.y = p.x * this.b + p.y * this.d + this.ty;

        return p;
    }

    public multiply(other: Matrix): Matrix {
        return this.clone().multiplyMut(other);
    }

    public multiplyMut(other: Matrix): Matrix {
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;
        this.a = a * other.a + c * other.b;
        this.b = b * other.a + d * other.b;
        this.c = a * other.c + c * other.d;
        this.d = b * other.c + d * other.d;
        this.tx = a * other.tx + c * other.ty + tx;
        this.ty = b * other.tx + d * other.ty + ty;
        this._inverse = null;

        return this;
    }

    /**
     * Return new matrix as a result of multiplication of the current matrix
     * by the matrix(1,0,0,1,tx,ty)
     */
    public translate(x: number, y: number): Matrix {
        return this.clone().multiplyMut(new Matrix(1, 0, 0, 1, x, y));
    }

    /**
     * Return new matrix as a result of multiplication of the current matrix
     * by the matrix that defines rotation by given angle (in radians) around
     * center of rotation (centerX,centerY) in counterclockwise direction
     * @param angle - angle in radians
     * @param centerX - center of rotation
     * @param centerY - center of rotation
     */
    public rotate(angle: number, centerX: number = 0.0, centerY: number = 0.0): Matrix {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        return this.translate(centerX, centerY)
            .multiply(new Matrix(cos, sin, -sin, cos, 0, 0))
            .translate(-centerX, -centerY);
    }

    /**
     * Return new matrix as a result of multiplication of the current matrix
     * by the matrix (sx,0,0,sy,0,0) that defines scaling
     * @param sx
     * @param sy
     */
    public scale(sx: number, sy: number): Matrix {
        return this.multiply(new Matrix(sx, 0, 0, sy, 0, 0));
    }

    public equalTo(matrix: Matrix): boolean {
        if (!EQ(this.tx, matrix.tx)) return false;
        if (!EQ(this.ty, matrix.ty)) return false;
        if (!EQ(this.a, matrix.a)) return false;
        if (!EQ(this.b, matrix.b)) return false;
        if (!EQ(this.c, matrix.c)) return false;
        if (!EQ(this.d, matrix.d)) return false;

        return true;
    }

    public isIdentity(): boolean {
        return (
            this.a === 1 &&
            this.b === 0 &&
            this.c === 0 &&
            this.d === 1 &&
            this.tx === 0 &&
            this.ty === 0
        );
    }
}

export const matrix = (a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number) =>
    new Matrix(a, b, c, d, tx, ty);
