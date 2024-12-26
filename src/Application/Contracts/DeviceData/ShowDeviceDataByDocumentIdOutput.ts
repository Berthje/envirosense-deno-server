import { AirData, Device } from "EnviroSense/Domain/mod.ts";

export interface ShowDeviceDataByDocumentIdOutput {
    documentId: string;
    documentId: string;
    device: Device;
    timestamp: Date;
    airData: AirData;
}
