import { assertEquals, assertThrows } from "@std/assert";
import {
Brightness,
    Building,
    Device,
    DeviceData,
    DeviceLimit,
    DeviceLimitType,
    DeviceState,
    DeviceUiModeType,
    DomainException,
    Room,
    RoomType,
	TemperatureLimit,
	UiMode,
} from "EnviroSense/Domain/mod.ts";

Deno.test("Device - create method with valid parameters", () => {
    // Arrange
    const documentId = "1";
    const identifier = "Device001";
    const building = Building.create("1", "Main Building", "123 Main St");
    const roomType = RoomType.create("1", "Office", "office_icon.png");
    const room = Room.create("1", "Office Room", building, roomType);

    // Act
    const device = Device.create(documentId, identifier, room);

    // Assert
    assertEquals(device.documentId, documentId);
    assertEquals(device.identifier, identifier);
    assertEquals(device.room, room);
});

Deno.test("Device - create method with empty identifier throws error", () => {
    // Arrange
    const documentId = "2";
    const identifier = "";
    const building = Building.create("2", "Main Building", "123 Main St");
    const roomType = RoomType.create("2", "Office", "office_icon.png");
    const room = Room.create("2", "Office Room", building, roomType);

    // Act & Assert
    assertThrows(
        () => {
            Device.create(documentId, identifier, room);
        },
        DomainException,
        "Identifier is required."
    );
});

Deno.test("Device - load method with valid state", () => {
    // Arrange
    const building = Building.create("3", "Main Building", "123 Main St");
    const roomType = RoomType.create("3", "Office", "office_icon.png");
    const room = Room.create("3", "Office Room", building, roomType);
    const state: DeviceState = {
        documentId: "3",
        identifier: "Device003",
        room: room,
        deviceData: [],
        limits: new Map(),
    };

    // Act
    const device = Device.load(state);

    // Assert
    assertEquals(device.documentId, state.documentId);
    assertEquals(device.identifier, state.identifier);
    assertEquals(device.room, room);
    assertEquals(device.deviceData, []);
});

Deno.test(
    "Device - load method with empty identifier in state throws error",
    () => {
        // Arrange
        const building = Building.create("4", "Main Building", "123 Main St");
        const roomType = RoomType.create("4", "Office", "office_icon.png");
        const room = Room.create("4", "Office Room", building, roomType);
        const state: DeviceState = {
            documentId: "4",
            identifier: "",
            room: room,
            deviceData: [],
            limits: new Map(),
        };

        // Act & Assert
        assertThrows(
            () => {
                Device.load(state);
            },
            DomainException,
            "Identifier is required."
        );
    }
);

Deno.test("Device - removeRoom method removes the room from the device", () => {
    // Arrange
    const documentId = "5";
    const identifier = "Device005";
    const building = Building.create("5", "Main Building", "123 Main St");
    const roomType = RoomType.create("5", "Office", "office_icon.png");
    const room = Room.create("5", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act
    device.removeRoom();

    // Assert
    assertEquals(device.room, null);
});

Deno.test(
    "Device - addRoom method adds a new room after removing the current room",
    () => {
        // Arrange
        const documentId = "6";
        const identifier = "Device006";

        const building = Building.create("6", "Main Building", "123 Main St");

        const roomType1 = RoomType.create("6", "Office", "office_icon.png");
        const room1 = Room.create("6", "Office Room", building, roomType1);
        building.addRoom(room1); // Add room1 to the building

        const roomType2 = RoomType.create(
            "7",
            "Conference",
            "conference_icon.png"
        );
        const room2 = Room.create("7", "Conference Room", building, roomType2);
        building.addRoom(room2); // Add room2 to the building

        const device = Device.create(documentId, identifier, room1);

        // Act
        device.removeRoom();
        device.addRoom(room2);

        // Assert
        assertEquals(device.room, room2);
    }
);

Deno.test("Device - updateIdentifier method with valid identifier", () => {
    // Arrange
    const documentId = "7";
    const oldIdentifier = "Device007";
    const newIdentifier = "Device007-Updated";
    const building = Building.create("7", "Main Building", "123 Main St");
    const roomType = RoomType.create("7", "Office", "office_icon.png");
    const room = Room.create("7", "Office Room", building, roomType);
    const device = Device.create(documentId, oldIdentifier, room);

    // Act
    device.updateIdentifier(newIdentifier);

    // Assert
    assertEquals(device.identifier, newIdentifier);
});

Deno.test(
    "Device - updateIdentifier method with empty identifier throws error",
    () => {
        // Arrange
        const documentId = "8";
        const oldIdentifier = "Device008";
        const newIdentifier = "";
        const building = Building.create("8", "Main Building", "123 Main St");
        const roomType = RoomType.create("8", "Office", "office_icon.png");
        const room = Room.create("8", "Office Room", building, roomType);
        const device = Device.create(documentId, oldIdentifier, room);

        // Act & Assert
        assertThrows(
            () => {
                device.updateIdentifier(newIdentifier);
            },
            DomainException,
            "Identifier is required."
        );
    }
);

Deno.test(
    "Device - addRoom method with room not assigned to building throws error",
    () => {
        // Arrange
        const documentId = "9";
        const identifier = "Device009";
        const building = Building.create("9", "Main Building", "123 Main St");
        const roomType = RoomType.create("9", "Office", "office_icon.png");

        // Create initial room and device
        const room1 = Room.create("9", "Office Room", building, roomType);
        building.addRoom(room1);
        const device = Device.create(documentId, identifier, room1);

        // Create room without building
        const roomType2 = RoomType.create(
            "10",
            "Conference",
            "conference_icon.png"
        );
        const roomWithoutBuilding = Room.create(
            "10",
            "Conference Room",
            null as unknown as Building,
            roomType2
        );

        // Act & Assert
        assertThrows(
            () => {
                device.addRoom(roomWithoutBuilding);
            },
            DomainException,
            "Room must be assigned to a building"
        );
    }
);

Deno.test(
    "Device - removeRoom method throws error when room is already null",
    () => {
        // Arrange
        const documentId = "10";
        const identifier = "Device010";
        const building = Building.create("10", "Main Building", "123 Main St");
        const roomType = RoomType.create("10", "Office", "office_icon.png");
        const room = Room.create("10", "Office Room", building, roomType);
        const device = Device.create(documentId, identifier, room);

        // First removal
        device.removeRoom();

        // Act & Assert
        assertThrows(
            () => {
                device.removeRoom();
            },
            DomainException,
            "Room is required."
        );
    }
);

Deno.test("Device - deviceData getter returns empty array by default", () => {
    // Arrange
    const documentId = "11";
    const identifier = "Device011";
    const building = Building.create("11", "Main Building", "123 Main St");
    const roomType = RoomType.create("11", "Office", "office_icon.png");
    const room = Room.create("11", "Office Room", building, roomType);

    // Act
    const device = Device.create(documentId, identifier, room);

    // Assert
    assertEquals(device.deviceData, []);
});

Deno.test("Device - removeRoom method removes room successfully", () => {
    // Arrange
    const documentId = "10";
    const identifier = "Device010";
    const building = Building.create("10", "Main Building", "123 Main St");
    const roomType = RoomType.create("10", "Office", "office_icon.png");
    const room = Room.create("10", "Office Room", building, roomType);
    building.addRoom(room);
    const device = Device.create(documentId, identifier, room);

    // Act
    device.removeRoom();

    // Assert
    assertEquals(device.room, null);
});

Deno.test("Device - removeRoom method throws error when room is null", () => {
    // Arrange
    const documentId = "11";
    const identifier = "Device011";
    const device = Device.create(
        documentId,
        identifier,
        null as unknown as Room
    );

    // Act & Assert
    assertThrows(
        () => {
            device.removeRoom();
        },
        DomainException,
        "Room is required."
    );
});

Deno.test("Device - addDeviceData method adds device data successfully", () => {
    // Arrange
    const documentId = "12";
    const identifier = "Device012";
    const device = Device.create(
        documentId,
        identifier,
        null as unknown as Room
    );
    const deviceData = DeviceData.create("1", device, new Date(), {
        temperature: 25,
        humidity: 50,
        ppm: 100,
    });

    // Act
    device.addDeviceData(deviceData);

    // Assert
    assertEquals(device.deviceData.length, 1);
    assertEquals(device.deviceData[0], deviceData);
});

Deno.test(
    "Device - updateIdentifier method updates identifier successfully",
    () => {
        // Arrange
        const documentId = "13";
        const identifier = "Device013";
        const device = Device.create(
            documentId,
            identifier,
            null as unknown as Room
        );
        const newIdentifier = "Device013Updated";

        // Act
        device.updateIdentifier(newIdentifier);

        // Assert
        assertEquals(device.identifier, newIdentifier);
    }
);

Deno.test(
    "Device - updateIdentifier method throws error when identifier is empty",
    () => {
        // Arrange
        const documentId = "14";
        const identifier = "Device014";
        const device = Device.create(
            documentId,
            identifier,
            null as unknown as Room
        );

        // Act & Assert
        assertThrows(
            () => {
                device.updateIdentifier("");
            },
            DomainException,
            "Identifier is required."
        );
    }
);

Deno.test(
    "Device - validateState method throws error when identifier is empty",
    () => {
        // Arrange
        const documentId = "15";
        const identifier = "";
        const building = Building.create("15", "Main Building", "123 Main St");
        const roomType = RoomType.create("15", "Office", "office_icon.png");
        const room = Room.create("15", "Office Room", building, roomType);

        // Act & Assert
        assertThrows(
            () => {
                Device.create(documentId, identifier, room);
            },
            DomainException,
            "Identifier is required."
        );
    }
);

Deno.test(
    "Device - addDeviceData adds first device data to empty array",
    () => {
        // Arrange
        const documentId = "16";
        const identifier = "Device016";
        const building = Building.create("16", "Main Building", "123 Main St");
        const roomType = RoomType.create("16", "Office", "office_icon.png");
        const room = Room.create("16", "Office Room", building, roomType);
        const device = Device.create(documentId, identifier, room);
        const deviceData = DeviceData.create("1", device, new Date(), {
            temperature: 25,
            humidity: 50,
            ppm: 100,
        });

        // Act
        device.addDeviceData(deviceData);

        // Assert
        assertEquals(device.deviceData.length, 1);
        assertEquals(device.deviceData[0], deviceData);
    }
);

Deno.test(
    "Device - removeRoom method ensures room exists before removal",
    () => {
        // Arrange
        const documentId = "17";
        const identifier = "Device017";
        const building = Building.create("17", "Main Building", "123 Main St");
        const roomType = RoomType.create("17", "Office", "office_icon.png");
        const room = Room.create("17", "Office Room", building, roomType);
        const device = Device.create(documentId, identifier, room);

        // Act & Assert
        assertThrows(
            () => {
                device.removeRoom();
                device.removeRoom(); // Try to remove again when room is already null
            },
            DomainException,
            "Room is required."
        );
    }
);

Deno.test(
    "Device - addDeviceData method with null deviceData throws error",
    () => {
        // Arrange
        const documentId = "24";
        const identifier = "Device024";
        const building = Building.create("24", "Main Building", "123 Main St");
        const roomType = RoomType.create("24", "Office", "office_icon.png");
        const room = Room.create("24", "Office Room", building, roomType);
        const device = Device.create(documentId, identifier, room);

        // Act & Assert
        assertThrows(
            () => {
                device.addDeviceData(null as unknown as DeviceData);
            },
            DomainException,
            "DeviceData is required"
        );
    }
);

Deno.test("Device - create method with null identifier throws error", () => {
    // Arrange
    const documentId = "25";
    const identifier = null;
    const building = Building.create("25", "Main Building", "123 Main St");
    const roomType = RoomType.create("25", "Office", "office_icon.png");
    const room = Room.create("25", "Office Room", building, roomType);

    // Act & Assert
    assertThrows(
        () => {
            Device.create(documentId, identifier as unknown as string, room);
        },
        DomainException,
        "Identifier is required."
    );
});

Deno.test("Device - updateLimit adds new temperature limit successfully", () => {
    // Arrange
    const documentId = "26";
    const identifier = "Device026";
    const building = Building.create("26", "Main Building", "123 Main St");
    const roomType = RoomType.create("26", "Office", "office_icon.png");
    const room = Room.create("26", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);
    const temperatureLimit = new TemperatureLimit(DeviceLimitType.TEMPERATURE, 25);

    // Act
    device.updateLimit(temperatureLimit);

    // Assert
    const storedLimit = device.getLimit(DeviceLimitType.TEMPERATURE);
    assertEquals(storedLimit?.type, DeviceLimitType.TEMPERATURE);
    assertEquals(storedLimit?.value, 25);
});

Deno.test("Device - updateLimit throws error with invalid temperature value", () => {
    // Arrange
    const documentId = "27";
    const identifier = "Device027";
    const building = Building.create("27", "Main Building", "123 Main St");
    const roomType = RoomType.create("27", "Office", "office_icon.png");
    const room = Room.create("27", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act & Assert
    assertThrows(
        () => {
            const invalidLimit = new TemperatureLimit(DeviceLimitType.TEMPERATURE, 90);
            device.updateLimit(invalidLimit);
        },
        DomainException,
        "Temperature must be between 0 and 80°C"
    );
});

Deno.test("Device - getLimit returns undefined for non-existent limit type", () => {
    // Arrange
    const documentId = "28";
    const identifier = "Device028";
    const building = Building.create("28", "Main Building", "123 Main St");
    const roomType = RoomType.create("28", "Office", "office_icon.png");
    const room = Room.create("28", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act
    const limit = device.getLimit(DeviceLimitType.TEMPERATURE);

    // Assert
    assertEquals(limit, undefined);
});

Deno.test("Device - updateUiMode sets new UI mode successfully", () => {
    // Arrange
    const documentId = "29";
    const identifier = "Device029";
    const building = Building.create("29", "Main Building", "123 Main St");
    const roomType = RoomType.create("29", "Office", "office_icon.png");
    const room = Room.create("29", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);
    const newUiMode = new UiMode(DeviceUiModeType.PPM);

    // Act
    device.updateUiMode(newUiMode);

    // Assert
    assertEquals(device.getUiMode().type, DeviceUiModeType.PPM);
});

Deno.test("Device - default UI mode is NORMAL", () => {
    // Arrange
    const documentId = "30";
    const identifier = "Device030";
    const building = Building.create("30", "Main Building", "123 Main St");
    const roomType = RoomType.create("30", "Office", "office_icon.png");
    const room = Room.create("30", "Office Room", building, roomType);

    // Act
    const device = Device.create(documentId, identifier, room);

    // Assert
    assertEquals(device.getUiMode().type, DeviceUiModeType.NORMAL);
});

Deno.test("Device - updateBrightness sets new brightness successfully", () => {
    // Arrange
    const documentId = "31";
    const identifier = "Device031";
    const building = Building.create("31", "Main Building", "123 Main St");
    const roomType = RoomType.create("31", "Office", "office_icon.png");
    const room = Room.create("31", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);
    const newBrightness = new Brightness(85);

    // Act
    device.updateBrightness(newBrightness);

    // Assert
    assertEquals(device.getBrightness().value, 85);
});

Deno.test("Device - default brightness is 80", () => {
    // Arrange
    const documentId = "32";
    const identifier = "Device032";
    const building = Building.create("32", "Main Building", "123 Main St");
    const roomType = RoomType.create("32", "Office", "office_icon.png");
    const room = Room.create("32", "Office Room", building, roomType);

    // Act
    const device = Device.create(documentId, identifier, room);

    // Assert
    assertEquals(device.getBrightness().value, 80);
});

Deno.test("Device - updateBrightness throws error with invalid brightness value", () => {
    // Arrange
    const documentId = "33";
    const identifier = "Device033";
    const building = Building.create("33", "Main Building", "123 Main St");
    const roomType = RoomType.create("33", "Office", "office_icon.png");
    const room = Room.create("33", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act & Assert
    assertThrows(
        () => {
            device.updateBrightness(new Brightness(15)); // Too low
        },
        DomainException,
        "Brightness must be between 20 and 100."
    );

    assertThrows(
        () => {
            device.updateBrightness(new Brightness(105)); // Too high
        },
        DomainException,
        "Brightness must be between 20 and 100."
    );
});

Deno.test("Device - load method preserves config and limits state", () => {
    // Arrange
    const building = Building.create("34", "Main Building", "123 Main St");
    const roomType = RoomType.create("34", "Office", "office_icon.png");
    const room = Room.create("34", "Office Room", building, roomType);
    const limits = new Map<DeviceLimitType, DeviceLimit>();
    limits.set(DeviceLimitType.TEMPERATURE, new TemperatureLimit(DeviceLimitType.TEMPERATURE, 25));

    const state: DeviceState = {
        documentId: "34",
        identifier: "Device034",
        room: room,
        deviceData: [],
        limits: limits,
        uiMode: new UiMode(DeviceUiModeType.TEMPERATURE),
        brightness: new Brightness(90)
    };

    // Act
    const device = Device.load(state);

    // Assert
    assertEquals(device.getLimit(DeviceLimitType.TEMPERATURE)?.value, 25);
    assertEquals(device.getUiMode().type, DeviceUiModeType.TEMPERATURE);
    assertEquals(device.getBrightness().value, 90);
});

Deno.test("Device - default config values are set correctly", () => {
    // Arrange
    const documentId = "30";
    const identifier = "Device030";
    const building = Building.create("30", "Main Building", "123 Main St");
    const roomType = RoomType.create("30", "Office", "office_icon.png");
    const room = Room.create("30", "Office Room", building, roomType);

    // Act
    const device = Device.create(documentId, identifier, room);

    // Assert
    assertEquals(device.getUiMode().type, DeviceUiModeType.NORMAL);
    assertEquals(device.getBrightness().value, 80);
});

Deno.test("Device - throws on invalid UI mode", () => {
    // Arrange
    const documentId = "32";
    const identifier = "Device032";
    const building = Building.create("32", "Main Building", "123 Main St");
    const roomType = RoomType.create("32", "Office", "office_icon.png");
    const room = Room.create("32", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act & Assert
    assertThrows(
        () => {
            device.updateUiMode(new UiMode("invalid" as DeviceUiModeType));
        },
        DomainException,
        "Invalid UI mode: invalid"
    );
});

Deno.test("Device - can update brightness to valid value", () => {
    // Arrange
    const documentId = "33";
    const identifier = "Device033";
    const building = Building.create("33", "Main Building", "123 Main St");
    const roomType = RoomType.create("33", "Office", "office_icon.png");
    const room = Room.create("33", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act
    device.updateBrightness(new Brightness(50));

    // Assert
    assertEquals(device.getBrightness().value, 50);
});

Deno.test("Device - throws on brightness below minimum", () => {
    // Arrange
    const documentId = "34";
    const identifier = "Device034";
    const building = Building.create("34", "Main Building", "123 Main St");
    const roomType = RoomType.create("34", "Office", "office_icon.png");
    const room = Room.create("34", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act & Assert
    assertThrows(
        () => {
            device.updateBrightness(new Brightness(10));
        },
        DomainException,
        "Brightness must be between 20 and 100"
    );
});

Deno.test("Device - can update existing limit", () => {
    // Arrange
    const documentId = "36";
    const identifier = "Device036";
    const building = Building.create("36", "Main Building", "123 Main St");
    const roomType = RoomType.create("36", "Office", "office_icon.png");
    const room = Room.create("36", "Office Room", building, roomType);
    const device = Device.create(documentId, identifier, room);

    // Act
    const initialLimit = new TemperatureLimit(DeviceLimitType.TEMPERATURE, 25);
    device.updateLimit(initialLimit);
    const updatedLimit = new TemperatureLimit(DeviceLimitType.TEMPERATURE, 30);
    device.updateLimit(updatedLimit);

    // Assert
    assertEquals(device.getLimit(DeviceLimitType.TEMPERATURE)?.value, 30);
});
