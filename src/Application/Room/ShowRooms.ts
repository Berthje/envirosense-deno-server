import {
	OutputPort,
	RoomQueryDto,
	RoomQueryRepository,
	ShowRoomsInput,
	ShowRoomsOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowRooms implements UseCase<ShowRoomsInput> {
	private readonly _outputPort: OutputPort<ShowRoomsOutput[]>;
	private readonly _roomQueryRepository: RoomQueryRepository;

	constructor(
		outputPort: OutputPort<ShowRoomsOutput[]>,
		roomQueryRepository: RoomQueryRepository,
	) {
		this._outputPort = outputPort;
		this._roomQueryRepository = roomQueryRepository;
	}

	public async execute(input: ShowRoomsInput): Promise<void> {
		const roomsDto = await this._roomQueryRepository.all(input.name);
		const rooms = this.mapDtoToOutput(roomsDto);
		this._outputPort.present(rooms);
	}

	private mapDtoToOutput(dto: RoomQueryDto[]): ShowRoomsOutput[] {
		return dto.map((item) => ({
			documentId: item.documentId,
			name: item.name,
			building: item.building,
			roomType: item.roomType,
			devices: item.devices,
		}));
	}
}
