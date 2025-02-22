import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowRoomsOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { Building, Device, RoomType } from "EnviroSense/Domain/mod.ts";

export type ShowRoomsPresentedData = {
	documentId: string;
	name: string;
	building: Building;
	roomType: RoomType;
	devices: Device[];
};

export class ShowRoomsPresenter implements OutputPort<ShowRoomsOutput[]> {
	private readonly _device: RequestResponseDevice<ShowRoomsPresentedData[]>;

	constructor(device: RequestResponseDevice<ShowRoomsPresentedData[]>) {
		this._device = device;
	}

	present(data: ShowRoomsOutput[]): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowRoomsOutput[],
	): ShowRoomsPresentedData[] {
		return data.map((room: ShowRoomsOutput) => ({
			documentId: room.documentId,
			name: room.name,
			building: room.building,
			roomType: room.roomType,
			devices: room.devices,
		}));
	}
}
