import type { IClient } from "@/structures/Client";

import type { ClientEvents, Collection } from "discord.js";

export interface ISubscription {
    unsubscribe(): void;
}

export type Events = keyof ClientEvents;

export interface ISubscriber<T extends Events> {
    run(client: IClient, ...args: ClientEvents[T]): Promise<void>
}

export type SubscriberList = Collection<Events, ISubscriber<any>[]>;

export interface IEventBus {
    subscribers: SubscriberList;

    subscribe<T extends Events>(event: T, subscriber: ISubscriber<T>): ISubscription;

    unsubscribe<T extends Events>(event: T): void;

    publish<T extends Events>(event: T, ...args: ClientEvents[T]): void;
}