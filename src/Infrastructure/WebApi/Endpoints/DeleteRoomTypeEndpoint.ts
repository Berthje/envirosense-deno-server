import { RouterContext } from '@oak/oak';
import {
    DeleteRoomTypeController,
    DeleteRoomTypePresenter,
    DeleteRoomTypeRequest,
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { ErrorsBag, RequestResponse } from 'EnviroSense/Infrastructure/Shared/mod.ts';

import { RoomTypeStrapiRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';

import { DeleteRoomType } from 'EnviroSense/Application/mod.ts';
import { RoomTypeRepository } from 'EnviroSense/Application/Contracts/mod.ts';

export class DeleteRoomTypeEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const request = await this.buildRequest(context);

        this.validateRequest(request);

        if (this._errorsBag.hasErrors) {
            context.response.status = 400;
            context.response.body = { errors: this._errorsBag.errors };
            return;
        }

        const outputDevice = new RequestResponse<void>();
        const presenter = new DeleteRoomTypePresenter(outputDevice);

        const repository: RoomTypeRepository = new RoomTypeStrapiRepository();

        const useCase = new DeleteRoomType(presenter, repository);

        const controller = new DeleteRoomTypeController(useCase);

        await controller.handle(request);

        context.response.status = 204;
    }

    private async buildRequest(context: RouterContext<string>): Promise<DeleteRoomTypeRequest> {
        return await context.request.body.json() as DeleteRoomTypeRequest;
    }

    private validateRequest(request: DeleteRoomTypeRequest): void {
        this._errorsBag.clear();

        if (!request.id) {
            this._errorsBag.add('id is required');
        }
    }
}
