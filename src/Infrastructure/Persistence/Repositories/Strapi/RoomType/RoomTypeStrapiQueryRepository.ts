import {
    RoomTypeQueryRepository,
    RoomTypeQueryDto,
} from "EnviroSense/Application/Contracts/mod.ts";
import { StrapiQueryRepository } from "../../../Shared/StrapiQueryRepository.ts";import { Optional } from 'EnviroSense/Domain/mod.ts';


export class RoomTypeStrapiQueryRepository
    extends StrapiQueryRepository
    implements RoomTypeQueryRepository
{
    async all(name: string): Promise<RoomTypeQueryDto[]> {
        const endpoint = "room-types";
        const params = name
            ? { "filters[name][$contains]": name, populate: "*" }
            : undefined;
        const response = await this.get<any>(endpoint, params);

        const roomTypes = response.data.map((item: any) => this.mapToDto(item));
        return roomTypes;
    }

    async find(roomTypeDocumentId: string): Promise<Optional<RoomTypeQueryDto>> {
        console.log("roomTypeDocumentId", roomTypeDocumentId);
        const endpoint = `room-types/${roomTypeDocumentId.toString()}`;
        const params: Record<string, string> = {};

        console.log("endpoint:params", endpoint, params);

        const response = await this.get<any>(endpoint, params);

        console.log("reponse", response);
        console.log("response.data", response.data);

        const roomType = this.mapToDto(response.data);

        console.log("roomType:", roomType);

        return Optional.of<RoomTypeQueryDto>(roomType);
    }

    private mapToDto(item: any): RoomTypeQueryDto {
        return {
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            icon: item.icon,
            rooms: item.rooms,
        };
    }
}
