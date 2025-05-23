import { ClientOnly } from '../../decorators';
import { Model, PoolObject } from '../game';
import { Vector3 } from '../geometry';

export class Entity extends PoolObject {
    constructor(handle: number) {
        super(handle);
    }

    public get position(): Vector3 {
        const coords = GetEntityCoords(this.handle);

        return new Vector3(coords[0], coords[1], coords[2]);
    }

    public set position(position: Vector3) {
        SetEntityCoords(this.handle, position.x, position.y, position.z, true, false, false, false);
    }

    public get rotation(): Vector3 {
        const rotation = GetEntityRotation(this.handle);

        return new Vector3(rotation[0], rotation[1], rotation[2]);
    }

    public set rotation(rotation: Vector3) {
        SetEntityRotation(this.handle, rotation.x, rotation.y, rotation.z, 2, true);
    }

    public get heading(): number {
        return GetEntityHeading(this.handle);
    }

    public set heading(heading: number) {
        SetEntityHeading(this.handle, heading);
    }

    public get velocity(): Vector3 {
        const velocity = GetEntityVelocity(this.handle);

        return new Vector3(velocity[0], velocity[1], velocity[2]);
    }

    public set velocity(velocity: Vector3) {
        SetEntityVelocity(this.handle, velocity.x, velocity.y, velocity.z);
    }

    public get model(): Model {
        return new Model(GetEntityModel(this.handle));
    }

    public get networkId(): number {
        return NetworkGetNetworkIdFromEntity(this.handle);
    }

    public get health(): number {
        return GetEntityHealth(this.handle);
    }

    public set health(health: number) {
        SetEntityHealth(this.handle, health);
    }

    public get maxHealth(): number {
        return GetEntityMaxHealth(this.handle);
    }

    public set maxHealth(maxHealth: number) {
        SetEntityMaxHealth(this.handle, maxHealth);
    }

    public get isFrozen(): boolean {
        return IsEntityPositionFrozen(this.handle);
    }

    public freeze(toggle: boolean): void {
        FreezeEntityPosition(this.handle, toggle);
    }

    @ClientOnly
    public isDead(): boolean {
        return IsEntityDead(this.handle);
    }

    @ClientOnly
    public isAlive(): boolean {
        return !this.isDead();
    }

    @ClientOnly
    public setMaxSpeed(speed: number): void {
        SetEntityMaxSpeed(this.handle, speed);
    }

    public exists(): boolean {
        return DoesEntityExist(this.handle);
    }

    public delete(): void {
        if (!IsDuplicityVersion()) {
            SetEntityAsMissionEntity(this.handle, false, true);
        }

        DeleteEntity(this.handle);
    }
}
