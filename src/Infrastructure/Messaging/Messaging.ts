import { Client } from "https://deno.land/x/mqtt@0.1.2/deno/mod.ts";
import "jsr:@std/dotenv/load";
import { MessageHandlerFactory, MessagingUseCaseRegistry } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class Messaging {
	private client: Client;
	private messageHandlerFactory: MessageHandlerFactory;

	constructor(useCaseRegistry: MessagingUseCaseRegistry) {
		this.client = new Client({
			url: Deno.env.get("MQTT_BROKER"),
			username: Deno.env.get("MQTT_USERNAME"),
			password: Deno.env.get("MQTT_PASSWORD"),
		});
		this.messageHandlerFactory = new MessageHandlerFactory(useCaseRegistry);
	}

	public async connect(): Promise<void> {
		await this.client.connect();
	}

	public async subscribe(topic: string): Promise<void> {
		await this.client.subscribe(topic);
		this.client.on("message", async (topic: string, payload: Uint8Array) => {
			const msg = new TextDecoder().decode(payload);
			const handler = this.messageHandlerFactory.getHandler(topic);
			await handler.handleMessage(topic, msg);
		});
	}

	public async publish(topic: string, message: string): Promise<void> {
		await this.client.publish(topic, message);
	}
}
