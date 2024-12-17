import {
	DeleteDeviceInput,
	DeviceRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteDevice implements UseCase<DeleteDeviceInput> {
	private readonly _deviceRepository: DeviceRepository;

	constructor(
		deviceRepository: DeviceRepository,
	) {
		this._deviceRepository = deviceRepository;
	}

	public async execute(input: DeleteDeviceInput): Promise<void> {
		const device =
			(await this._deviceRepository.find(input.deviceDocumentId))
				.orElseThrow(() =>
					new Error(
						`Device with ID ${input.deviceDocumentId} not found.`,
					)
				);

		await this._deviceRepository.deleteEntity(device);
	}
}
