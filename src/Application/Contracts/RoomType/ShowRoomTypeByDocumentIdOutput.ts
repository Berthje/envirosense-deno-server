import { Room } from "EnviroSense/Domain/mod.ts";

export interface ShowRoomTypeByDocumentIdOutput {
	documentId: string;
	name: string;
	icon: string;
	rooms: Room[];
}
