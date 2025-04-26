import type { IClient } from "@/structures/Client";
import type { ISubscriber } from "@/structures/Events";

import { Events, REST, Routes } from "discord.js";

export default class ReadyEvent implements ISubscriber<Events.ClientReady> {
    async run(client: IClient<true>): Promise<void> {
        client.console.log("");
        client.console.ready("The client is ready!");

        if (client.configuration.commands.register) {
            client.console.log("");
            client.console.start("Registering commands...");

            try {
                await this.#registerCommands(client);
            } catch (error) {
                client.console.error("An error occurred while registering commands.", error);
                return;
            }

            client.console.success("Commands have been registered!");
        }

        client.user.setPresence({
            status: client.configuration.presence.status,
            afk: client.configuration.presence.afk,
            activities: [client.configuration.presence.activity]
        });

        client.emit(Events.GuildMemberAdd, client.guilds.cache.first()?.members.me!);
    }

    async #registerCommands(client: IClient<true>) {
        const rest = new REST().setToken(client.configuration.token);
        const commands = client.commandHandler.cache.map((command) => command.data.toJSON());

        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    }
}