import { Room } from "EnviroSense/Domain/mod.ts";

export interface ShowRoomTypesOutput {
	documentId: string;
	name: string;
	icon: string;
	rooms: Room[];
}
