import { ButtonBuilder, Collection, type ButtonInteraction, type ButtonStyle, type ComponentEmojiResolvable } from "discord.js";
import type { IClient, IHandler, IListener } from "./Client";

export abstract class IButton implements IListener<ButtonInteraction> {
    abstract id: string;

    abstract label: string;

    abstract style: ButtonStyle;

    abstract emoji?: ComponentEmojiResolvable;

    abstract cooldown?: number;

    abstract execute(client: IClient<true>, interaction: ButtonInteraction): Promise<void>;

    build(): ButtonBuilder {
        const btn = new ButtonBuilder()
            .setCustomId(this.id)
            .setLabel(this.label)
            .setStyle(this.style);

        if (this.emoji) btn.setEmoji(this.emoji);

        return btn;
    }
}

export type ButtonCollection = Collection<string, IButton>;

export interface IButtonHandler extends IHandler<ButtonInteraction, IButton> {};
