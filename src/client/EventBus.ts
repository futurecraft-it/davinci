import type { IClient } from "@/structures/Client";
import type { Events, IEventBus, ISubscriber, ISubscription, SubscriberList } from "@/structures/Events";
import { Collection, type ClientEvents } from "discord.js";

export default class EventBus implements IEventBus {
    readonly #subscribers: SubscriberList = new Collection<Events, ISubscriber<any>[]>();

    public constructor(private _client: IClient) { }

    get subscribers(): SubscriberList {
        return this.#subscribers;
    }

    subscribe<T extends Events>(event: T, subscriber: ISubscriber<T>): ISubscription {
        const subscribers = this.#subscribers.get(event) ?? [];

        if (subscribers.length === 0) {
            this._client.on(event, (...args: ClientEvents[T]) => {
                this.publish(event, ...args);
            });
        }

        subscribers.push(subscriber);
        this.#subscribers.set(event, subscribers);

        const unsubscribe = () => {
            const index = subscribers.indexOf(subscriber);

            if (index !== -1) {
                subscribers.splice(index, 1);
                this.#subscribers.set(event, subscribers);
            }

            if (subscribers.length === 0) {
                this.#subscribers.delete(event);
            }
        };

        return { unsubscribe };
    }

    unsubscribe<T extends Events>(event: T): void {
        this.#subscribers.delete(event);
        this._client.removeAllListeners(event);

        this._client.console.info(`Unsubscribed from event "${event}".`);
    }

    publish<T extends Events>(event: T, ...args: ClientEvents[T]): void {
        const subscribers = this.#subscribers.get(event);

        if (!subscribers) {
            this._client.console.warn(`No subscribers for event "${event}".`);
            return;
        }

        for (const subscriber of subscribers) {
            subscriber.run(this._client, ...args).catch((error) => {
                this._client.console.error(`An error occurred while executing the subscriber for event "${event}".`, error);
            });
        }
    }
}