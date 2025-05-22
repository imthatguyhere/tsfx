import { ClientOnly } from '../../decorators';
import { Vector3 } from '../geometry';

export class Model {
    private readonly _hash: number;

    constructor(hash: number | string) {
        if (typeof hash === 'string') {
            this._hash = GetHashKey(hash);
        } else {
            this._hash = hash;
        }
    }

    public get hash(): number {
        return this._hash;
    }

    @ClientOnly
    public get dimensions(): Vector3 {
        const [min, max] = GetModelDimensions(this._hash);
        const right = new Vector3(min[0], min[1], min[2]);
        const left = new Vector3(max[0], max[1], max[2]);

        return left.subtract(right);
    }

    @ClientOnly
    public isValid(): boolean {
        return IsModelValid(this._hash);
    }

    @ClientOnly
    public isInCdImage(): boolean {
        return IsModelInCdimage(this._hash);
    }

    @ClientOnly
    public isLoaded(): boolean {
        return HasModelLoaded(this._hash);
    }

    @ClientOnly
    public isCollisionLoaded(): boolean {
        return HasCollisionForModelLoaded(this._hash);
    }

    @ClientOnly
    public isBicycle(): boolean {
        return IsThisModelABicycle(this._hash);
    }

    @ClientOnly
    public isBike(): boolean {
        return IsThisModelABike(this._hash);
    }

    @ClientOnly
    public isBoat(): boolean {
        return IsThisModelABoat(this._hash);
    }

    @ClientOnly
    public isCar(): boolean {
        return IsThisModelACar(this._hash);
    }

    @ClientOnly
    public isHelicopter(): boolean {
        return IsThisModelAHeli(this._hash);
    }

    @ClientOnly
    public isPlane(): boolean {
        return IsThisModelAPlane(this._hash);
    }

    @ClientOnly
    public isQuadbike(): boolean {
        return IsThisModelAQuadbike(this._hash);
    }

    @ClientOnly
    public isTrain(): boolean {
        return IsThisModelATrain(this._hash);
    }

    @ClientOnly
    public isVehicle(): boolean {
        return IsModelAVehicle(this._hash);
    }

    @ClientOnly
    public isPed(): boolean {
        return IsModelAPed(this._hash);
    }

    @ClientOnly
    public isWeapon(): boolean {
        return this.isValid() && IsWeaponValid(this._hash);
    }

    @ClientOnly
    public isObject(): boolean {
        return this.isValid() && !this.isPed() && !this.isVehicle() && !this.isWeapon();
    }

    @ClientOnly
    public load(timeout: number = 1000): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (!this.isInCdImage() && !this.isWeapon()) {
                resolve(false);
            }

            RequestModel(this._hash);

            const start = GetGameTimer();

            const interval = setInterval(() => {
                if (this.isLoaded() || GetGameTimer() - start >= timeout) {
                    clearInterval(interval);
                    this.unload();
                    resolve(this.isLoaded());
                }
            }, 0);
        });
    }

    @ClientOnly
    public unload(): void {
        SetModelAsNoLongerNeeded(this._hash);
    }
}
