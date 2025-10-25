import type { SubChannel } from './sub-channel';
import { Channel } from './channel';

export class MasterChannel extends Channel {
    public listeners: Record<string, SubChannel[]> = {};

    public channels: Set<SubChannel> = new Set();

    private callbackFn: CallableFunction | undefined;

    off(subChannel: SubChannel, event: string) {
        this.listeners[event] = this.listeners[event].filter((channel) => channel !== subChannel);

        if (this.listeners[event].length === 0) {
            delete this.listeners[event];
            this._off(event, this.callbackFn);
        }
    }

    /**
     * Register event
     */
    on(subChannel: SubChannel, event: string) {
    
        if (!this.listeners[event]) {
            this.listeners[event] = [];

            this.callbackFn = (payload: any) => this.emit(event, payload);
            this._on(event, this.callbackFn);
        }

        this.listeners[event].push(subChannel);
    }

    private emit(event: string, payload: any) {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach((channel) => channel.emit(event, payload));
    }

    register(subChannel: SubChannel) {
        this.channels.add(subChannel);
    }

    unregister(subChannel: SubChannel) {
        this.channels.delete(subChannel);

        if (this.channels.size === 0) {
            this.unsubscribe();

            this.channelManager.unsubscribe(this.name);
        }
    }
}
