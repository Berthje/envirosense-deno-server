import { Optional, RoomType } from "EnviroSense/Domain/mod.ts";
import { RoomTypeRepository } from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export class RoomTypeStrapiRepository extends StrapiQueryRepository implements RoomTypeRepository {
	async find(roomTypeDocumentId: string): Promise<Optional<RoomType>> {
		const endpoint = `room-types/${roomTypeDocumentId.toString()}`;
		const params: Record<string, string> = {};

		try {
			const response = await this.get<any>(endpoint, params);
			const roomType = this.mapToDomain(response.data);
			return Optional.of<RoomType>(roomType);
		} catch {
			return Optional.empty<RoomType>();
		}
	}

	async save(roomType: RoomType): Promise<void> {
		const endpoint = `room-types`;
		const body = this.mapFromDomain(roomType);

		return await this.post(endpoint, { data: body });
	}

	async update(roomType: RoomType): Promise<void> {
		const endpoint = `room-types/${roomType.documentId}`;
		const body = this.mapFromDomain(roomType);

		return await this.put(endpoint, { data: body });
	}

	async deleteEntity(roomType: RoomType): Promise<void> {
		const endpoint = `room-types/${roomType.documentId}`;

		return await this.delete(endpoint);
	}

	private mapToDomain(data: any): RoomType {
		const roomType = RoomType.load({
			documentId: data.documentId.toString(),
			name: data.name,
			icon: data.icon || "default-icon.png",
		});

		return roomType;
	}

	private mapFromDomain(roomType: RoomType): any {
		return {
			name: roomType.name,
			icon: this.getIconId(roomType.icon),
		};
	}

	private getIconId(
		icon: string | { documentId: string } | null,
	): string | null {
		if (!icon) {
			return null;
		}

		if (typeof icon === "object" && "documentId" in icon) {
			return icon.documentId;
		}

		return icon;
	}
}
