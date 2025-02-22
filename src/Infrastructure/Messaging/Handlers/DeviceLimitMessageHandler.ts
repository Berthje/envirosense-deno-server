import { UpdateDeviceLimitInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { MessageHandler } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class DeviceLimitMessageHandler implements MessageHandler {
	private lastPublishedTopic?: string;
	private lastPublishedMessage?: string;

	constructor(private updateDeviceLimitUseCase: UseCase<UpdateDeviceLimitInput>) {}

	async handleMessage(topic: string, payload: string): Promise<void> {
		if (topic === this.lastPublishedTopic && payload === this.lastPublishedMessage) {
			this.lastPublishedTopic = undefined;
			this.lastPublishedMessage = undefined;
			return;
		}

		const deviceIdentifier = this.getDeviceId(topic);
		const limitType = this.getLimitType(topic);
		const data = JSON.parse(payload);

		const input: UpdateDeviceLimitInput = {
			deviceDocumentId: deviceIdentifier,
			limitType: limitType,
			value: data.value,
		};

		await this.updateDeviceLimitUseCase.execute(input);
	}

	setLastPublished(topic: string, message: string): void {
		this.lastPublishedTopic = topic;
		this.lastPublishedMessage = message;
	}

	canHandle(topic: string): boolean {
		// Ignore request/response messages
		if (topic.includes("/limits/request") || topic.includes("/limits/response")) {
			return false;
		}

		// Only handle direct limit updates
		return topic.match(/devices\/.*\/limits\/[^\/]+$/) !== null;
	}

	private getDeviceId(topic: string): string {
		return topic.split("/")[1] ?? "";
	}

	private getLimitType(topic: string): string {
		return topic.split("/")[3] ?? "";
	}
}
