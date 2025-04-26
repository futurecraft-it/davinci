import type { IClient } from "@/structures/Client";
import type { ISubscriber } from "@/structures/Events";
import type { Events, Interaction } from "discord.js";

export default class InteractionCreateEvent implements ISubscriber<Events.InteractionCreate> {
    async run(client: IClient<true>, interaction: Interaction): Promise<void> {
        if (interaction.isChatInputCommand()) {
            client.commandHandler.run(client, interaction);
        }

        if (interaction.isButton()) {
            client.buttonHandler.run(client, interaction);
        }
    }
}