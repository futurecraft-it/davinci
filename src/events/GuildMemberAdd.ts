import type { IClient } from "@/structures/Client";
import type { ISubscriber } from "@/structures/Events";
import type { GuildMember } from "discord.js";

export default class GuildMemberAdd implements ISubscriber<"guildMemberAdd"> {
    async run(client: IClient<true>, member: GuildMember): Promise<void> {
        const { guild, user } = member;

        const channel = guild.channels.cache.get(client.configuration.guild.channels.welcome);
        if (!channel || !channel.isTextBased()) return;

        await channel.send({
            content: `Welcome ${user.username} to ${guild.name}!`,
            allowedMentions: {
                users: [user.id]
            }
        });
    }    
}