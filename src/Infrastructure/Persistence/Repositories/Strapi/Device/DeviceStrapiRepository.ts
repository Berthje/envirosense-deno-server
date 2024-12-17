import { Device, Optional } from 'EnviroSense/Domain/mod.ts';
import { StrapiQueryRepository } from '../../../Shared/StrapiQueryRepository.ts';
import { DeviceRepository } from 'EnviroSense/Application/Contracts/mod.ts';

export enum DeviceDataOperation {
    ADD = 'connect',
    REMOVE = 'disconnect',
}

export class DeviceStrapiRepository extends StrapiQueryRepository implements DeviceRepository {
    async find(deviceDocumentId: string): Promise<Optional<Device>> {
        const endpoint = `devices/${deviceDocumentId.toString()}`;
        const params: Record<string, string> = {};

        try {
            const response = await this.get<any>(endpoint, params);
            const device = this.mapToDomain(response.data);
            return Optional.of<Device>(device);
        } catch {
            return Optional.empty<Device>();
        }
    }

    async findByIdentifier(identifier: string): Promise<Optional<Device>> {
        const endpoint = `devices`;
        const params = {
            'filters[identifier][$eq]': identifier,
            populate: '*',
        };

        try {
            const response = await this.get<any>(endpoint, params);
            if (response.data.length === 0) {
                throw new Error('Device not found');
            }
            const device = this.mapToDomain(response.data[0]);
            return Optional.of<Device>(device);
        } catch {
            return Optional.empty<Device>();
        }
    }

    async save(device: Device): Promise<void> {
        const endpoint = `devices`;
        const body = this.mapFromDomain(device);

        return await this.post(endpoint, { data: body });
    }

    async update(device: Device): Promise<void> {
        const endpoint = `devices/${device.id}`;
        const body = this.mapFromDomain(device);

        return await this.put(endpoint, { data: body });
    }

    async manageDeviceData(
        deviceDocumentId: string,
        deviceDataDocumentIds: string[],
        operation: DeviceDataOperation,
    ) {
        const endpoint = `devices/${deviceDocumentId}`;

        const body = {
            'device_data': {
                [operation]: deviceDataDocumentIds,
            },
        };
        await this.put(endpoint, { data: body });
    }

    async deleteEntity(device: Device): Promise<void> {
        const endpoint = `devices/${device.id}`;

        return await this.delete(endpoint);
    }

    private mapToDomain(data: any): Device {
        const device = Device.load({
            id: data.documentId,
            identifier: data.identifier,
            room: data.room,
            deviceData: data.deviceData,
        });

        return device;
    }

    private mapFromDomain(device: Device): any {
        return {
            identifier: device.identifier,
            room: device.room
                ? {
                    connect: [device.room.id],
                }
                : null,
            device_data: device.deviceData,
        };
    }
}
