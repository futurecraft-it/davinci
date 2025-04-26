import type { IClient, IHandler, IListener } from "@/structures/Client";

import { Collection, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";

export type CommandCollection = Collection<string, ICommand>;

export interface ICommand extends IListener<ChatInputCommandInteraction> {
    name: string;

    cooldown?: number;

    data: SlashCommandBuilder;
}

export interface ICommandHandler extends IHandler<ChatInputCommandInteraction, ICommand> {}
