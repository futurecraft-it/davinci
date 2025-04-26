import { BaseInteraction, Client, Collection } from "discord.js";
import type { ConsolaInstance } from "consola";

import type { IEventBus } from "@/structures/Events";
import type { ICommandHandler } from "@/structures/Command";
import type { IConfiguration } from "@/structures/Configuration";
import type { IButtonHandler } from "./Button";

export abstract class IClient<ready extends boolean = boolean> extends Client<ready> {
    readonly abstract configuration: IConfiguration;
    readonly abstract console: ConsolaInstance;

    readonly abstract commandHandler: ICommandHandler;
    readonly abstract buttonHandler: IButtonHandler;
    
    readonly abstract bus: IEventBus;

    abstract start(): Promise<void>;
};


export interface IHandler<I extends BaseInteraction, T extends IListener<I>> {
    cache: Collection<string, T>;

    register(listener: T): void;

    unregister(listener: T): void;

    run(client: IClient<true>, interaction: I): Promise<void>;
}

export interface IListener<I extends BaseInteraction> {
    execute(client: IClient<true>, interaction: I): Promise<void>;
}
