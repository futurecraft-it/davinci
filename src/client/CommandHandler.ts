import type { IClient } from "@/structures/Client";
import type { CommandCollection, ICommand, ICommandHandler } from "@/structures/Command";

import { Collection, MessageFlags, type ChatInputCommandInteraction } from "discord.js";

export default class CommandHandler implements ICommandHandler {
    readonly #commands: CommandCollection = new Collection<string, ICommand>();

    readonly #cooldowns: Collection<string, number> = new Collection<string, number>();

    get cache(): CommandCollection {
        return this.#commands;
    }

    register(command: ICommand): void {
        this.#commands.set(command.name, command);
    }

    unregister(command: ICommand): void {
        this.#commands.delete(command.name);
        this.#cooldowns.delete(command.name);
    }

    async run(client: IClient<true>, interaction: ChatInputCommandInteraction): Promise<void> {
        const command = this.#commands.get(interaction.commandName);

        if (!command) {
            client.console.error(`Could not find command "${interaction.commandName}".`);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "Command not found.", flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: "Command not found.", flags: MessageFlags.Ephemeral });
            }

            return;
        }

        if (command.cooldown) {
            const now = Date.now();
            const last = this.#cooldowns.get(command.name) ?? 0;

            const delta = now - last;

            if (delta < command.cooldown * 1000) {
                const remaining = Math.ceil(command.cooldown - delta / 1000);

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: `Please wait ${remaining} seconds before using this command again.`, flags: MessageFlags.Ephemeral });
                } else {
                    await interaction.reply({ content: `Please wait ${remaining} seconds before using this command again.`, flags: MessageFlags.Ephemeral });
                }

                return;
            }

        }

        try {
            await command.execute(client, interaction);

            if (command.cooldown) {
                this.#cooldowns.set(command.name, Date.now());
            }
        } catch (error) {
            client.console.error("An error occurred while executing the command.", error);

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: "An error occurred while executing the command.", flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: "An error occurred while executing the command.", flags: MessageFlags.Ephemeral });
            }
        }
    }
}