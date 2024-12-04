import { DeviceData, Room } from 'EnviroSense/Domain/mod.ts';

export interface ShowBuildingsOutput {
    id: string;
    documentId: string;
    identifier: string;
    room: Room;
    device_data: DeviceData[];
}
