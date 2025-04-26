import type { IClient } from "@/structures/Client";
import type { ButtonCollection, IButton, IButtonHandler } from "@/structures/Button";

import { Collection, MessageFlags, type ButtonInteraction, type CacheType } from "discord.js";

export default class ButtonHandler implements IButtonHandler {
    readonly #buttons: ButtonCollection = new Collection<string, IButton>();

    readonly #cooldowns: Collection<string, number> = new Collection<string, number>();

    get cache(): ButtonCollection {
        return this.#buttons;
    }

    register(listener: IButton): void {
        this.#buttons.set(listener.id, listener);

    }

    unregister(listener: IButton): void {
        this.#buttons.delete(listener.id);
        this.#cooldowns.delete(listener.id);
    }

    async run(client: IClient<true>, interaction: ButtonInteraction<CacheType>): Promise<void> {
        const button = this.#buttons.get(interaction.customId);

        if (!button) {
            client.console.error(`Could not find button "${interaction.customId}".`);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "Button not found.", flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: "Button not found.", flags: MessageFlags.Ephemeral });
            }

            return;
        }


        if (button.cooldown) {
            const now = Date.now();
            const last = this.#cooldowns.get(button.id) ?? 0;

            const delta = now - last;

            if (delta < button.cooldown * 1000) {
                const remaining = Math.ceil(button.cooldown - delta / 1000);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: `Please wait ${remaining} seconds before using this button again.`, flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: `Please wait ${remaining} seconds before using this button again.`, flags: MessageFlags.Ephemeral });
                }

                return;
            }
        }

        try {
            await button.execute(client, interaction);

            if (button.cooldown) {
                this.#cooldowns.set(button.id, Date.now());
            }
        }
        catch (error) {
            client.console.error("An error occurred while executing the button.", error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "An error occurred while executing the button.", flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: "An error occurred while executing the button.", flags: MessageFlags.Ephemeral });
            }
        }
    }
}
   