import { z } from 'zod';
import { ActivityType } from 'discord.js';

export const Configuration = z.object({
    token: z.string(),
    commands: z.object({
        register: z.boolean()
    }),
    presence: z.object({
        status: z.enum(["online", "idle", "dnd", "invisible"]),
        afk: z.boolean(),
        activity: z.object({
            name: z.string(),
            type: z.nativeEnum(ActivityType),
            state: z.string(),
            url: z.string().url().optional()
        })
    }),
    guild: z.object({
        channels: z.object({
            welcome: z.string(),
        }),
    }),
});

export type IConfiguration = z.infer<typeof Configuration>;