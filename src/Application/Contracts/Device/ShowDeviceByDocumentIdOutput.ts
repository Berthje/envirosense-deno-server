import { DeviceData, Room } from "EnviroSense/Domain/mod.ts";

export interface ShowDeviceByDocumentIdOutput {
    id: string;
    documentId: string;
    identifier: string;
    room: Room;
    device_data: DeviceData[];
}
