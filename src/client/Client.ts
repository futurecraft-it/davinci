import  EventBus from "@/client/EventBus";
import { IClient } from "@/structures/Client";
import  CommandHandler from "@/client/CommandHandler";
import { Configuration, type IConfiguration } from "@/structures/Configuration";

import { readFileSync } from "fs";
import { parseTOML } from "confbox";
import { createConsola } from "consola";
import type { ClientOptions } from "discord.js";
import ButtonHandler from "./ButtonHandler";



export default class Client<Ready extends boolean = boolean> extends IClient<Ready> {
    readonly #configuration: IConfiguration;
    readonly #console = createConsola();

    readonly #commandHandler: CommandHandler;
    readonly #buttonHandler: ButtonHandler;

    readonly #eventBus: EventBus;


    constructor(path: string, options: ClientOptions) {
        super(options);

        // Reading File
        const file = readFileSync(path, { encoding: "utf-8" });
        const data = parseTOML(file);

        // Parsing Configuration
        this.#configuration = Configuration.parse(data);
        
        // Command Handler
        this.#commandHandler = new CommandHandler();

        this.#buttonHandler = new ButtonHandler();

        // Event Bus
        this.#eventBus = new EventBus(this);
    }

    override get configuration(): IConfiguration {
        return this.#configuration;
    }

    override get console() {
        return this.#console;
    }

    override get commandHandler(): CommandHandler {
        return this.#commandHandler;
    }

    override get buttonHandler(): ButtonHandler {
        return this.#buttonHandler;
    }

    override get bus(): EventBus {
        return this.#eventBus;
    }

    override async start(): Promise<void> {
        this.#console.start("Connecting the client to Discord gateway...");

        try { await super.login(this.configuration.token); }
        catch (error) {
            this.#console.error("An error occurred while connecting to the Discord gateway.", error);
            return;
        }

        this.#console.success("The client has been started!");
    }


    // Discord.js Methods Override
    override login(token?: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}