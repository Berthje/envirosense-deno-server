import { DeviceData, Room } from "EnviroSense/Domain/mod.ts";

export interface ShowDevicesOutput {
	documentId: string;
	documentId: string;
	identifier: string;
	room: Room;
	device_data: DeviceData[];
}
