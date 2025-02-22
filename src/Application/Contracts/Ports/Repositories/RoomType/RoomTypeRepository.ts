import { Optional, RoomType } from "EnviroSense/Domain/mod.ts";

export interface RoomTypeRepository {
	find(roomTypeDocumentId: string): Promise<Optional<RoomType>>;
	save(roomType: RoomType): Promise<void>;
	update(roomType: RoomType): Promise<void>;
	deleteEntity(roomType: RoomType): Promise<void>;
}
