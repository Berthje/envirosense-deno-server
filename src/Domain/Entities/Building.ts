import { Room } from "EnviroSense/Domain/mod.ts";
import { DomainException } from "EnviroSense/Domain/Shared/Exceptions/DomainException.ts";

export interface BuildingState {
    id: string;
    name: string;
    address: string;
    rooms?: Room[];
}

export class Building {
    private readonly _id: string;
    private _name: string;
    private _address: string;
    private _rooms: Room[] = [];

    private constructor(id: string, name: string, address: string) {
        this._id = id;
        this._name = name;
        this._address = address;
    }

    static create(id: string, name: string, address: string): Building {
        const building = new Building(id, name, address);
        building.validateState();

        return building;
    }

    static load(state: BuildingState): Building {
        const building = new Building(state.id, state.name, state.address);
        building.validateState();

        return building;
    }

    public updateName(name: string): void {
        this._name = name;
    }

    public updateAddress(address: string): void {
        this._address = address;
    }

    public updateRooms(rooms: Room[]): void {
        this._rooms = rooms;
    }

    public validateState(): void {
        this.ensureNameIsNotEmpty();
        this.ensureAddressIsNotEmpty();
    }

    public addRoom(room: Room): void {
        this.ensureRoomDoesNotExist(room);

        this._rooms.push(room);
    }

    public removeRoom(roomId: string): void {
        this.ensureRoomExists(roomId);

        this._rooms = this._rooms.filter((room) => room.id !== roomId);
    }

    private ensureNameIsNotEmpty(): void {
        if (!this._name) {
            throw new DomainException("Name is required");
        }
    }

    private ensureAddressIsNotEmpty(): void {
        if (!this._address) {
            throw new DomainException("Address is required");
        }
    }

    private ensureRoomDoesNotExist(room: Room): void {
        if (this._rooms.some((r) => r.id === room.id)) {
            throw new DomainException("Room already exists");
        }
    }

    public ensureRoomExists(roomId: string): void {
        if (!this._rooms.some((room) => room.id === roomId)) {
            throw new DomainException("Room does not exist");
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): string {
        return this._address;
    }

    get rooms(): Room[] {
        return this._rooms;
    }
}
