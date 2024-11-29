import { RouterContext } from "@oak/oak";
import {
    Endpoint,
    ShowRoomsController,
    ShowRoomsPresentedData,
    ShowRoomsPresenter,
    ShowRoomsRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { RoomStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowRooms } from "EnviroSense/Application/mod.ts";

export class ShowRoomsEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<ShowRoomsPresentedData[]>();
        const presenter = new ShowRoomsPresenter(outputDevice);

        const repository = new RoomStrapiQueryRepository();

        const useCase = new ShowRooms(presenter, repository);

        const controller = new ShowRoomsController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set("Content-Type", "application/json");
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowRoomsEndpoint();
    }

    private buildRequest(context: RouterContext<string>): ShowRoomsRequest {
        const type = context.request.url.searchParams.get("type")
            ? context.request.url.searchParams.get("type")
            : "";

        return { type } as ShowRoomsRequest;

        //TODO: probably change type here since it was code of tournament (dimitri casier)
        //=> type maybe doesn't apply to our room entity
    }
}
