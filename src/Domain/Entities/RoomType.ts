import { DomainException } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeState {
    id: string;
    name: string;
    icon: string;
}

export class RoomType {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _icon: string;

    private constructor(id: string, name: string, icon: string) {
        this._id = id;
        this._name = name;
        this._icon = icon;
    }

    static create(id: string, name: string, icon: string): RoomType {
        const room_type = new RoomType(id, name, icon);
        room_type.validateState();

        return room_type;
    }

    static load(state: RoomTypeState): RoomType {
        const room_type = new RoomType(
            state.id,
            state.name,
            state.icon
        );
        room_type.validateState();

        return room_type;
    }

    public validateState(): void {
        this.ensureNameIsNotEmpty();
        this.ensureIconIsNotEmpty();
    }

    private ensureNameIsNotEmpty(): void {
        if (!this._name) {
            throw new DomainException("Room type name cannot be empty.");
        }
    }

    private ensureIconIsNotEmpty(): void {
        if (!this._icon) {
            throw new DomainException("Room type icon cannot be empty.");
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get icon(): string {
        return this._icon;
    }
}
