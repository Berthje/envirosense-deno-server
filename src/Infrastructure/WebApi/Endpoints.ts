import { Router, RouterContext } from "@oak/oak";
import {
    Endpoint,
    TestEndpoint,
    ShowRoomsEndpoint,
    ShowDeviceDataEndpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ShowBuildingsEndpoint } from "EnviroSense/Infrastructure/WebApi/Endpoints/ShowBuildingsEndpoint.ts";
import { ShowRoomTypesEndpoint } from "EnviroSense/Infrastructure/WebApi/Endpoints/ShowRoomTypesEndpoint.ts";

function use(endpoint: Endpoint) {
    return (context: RouterContext<string>) => endpoint.handle(context);
}

export function endpoints(): Router {
    const router = new Router();

    router.get("/", use(new TestEndpoint())); //maybe show docs of openApi.yml?
    router.get("/rooms", use(new ShowRoomsEndpoint()));
    router.get("/buildings", use(new ShowBuildingsEndpoint()));
    router.get("/room-types", use(new ShowRoomTypesEndpoint()));
    router.get("/device-data", use(new ShowDeviceDataEndpoint()));

    return router;
}
