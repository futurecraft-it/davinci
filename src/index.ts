import Client from "@/client/Client";

import ReadyEvent from "@/events/Ready";
import GuildMemberAddEvent from "@/events/GuildMemberAdd";
import InteractionCreateEvent from "@/events/InteractionCreate";

import { Events } from "discord.js";

const client = new Client("./config.local.toml", {
    intents: ["Guilds", "GuildMessages"]
});

const ready = new ReadyEvent();
const interactionCreate = new InteractionCreateEvent();
const guildMemberAdd = new GuildMemberAddEvent();

client.bus.subscribe(Events.ClientReady, ready);
client.bus.subscribe(Events.GuildMemberAdd, guildMemberAdd);
client.bus.subscribe(Events.InteractionCreate, interactionCreate);

client.start();
